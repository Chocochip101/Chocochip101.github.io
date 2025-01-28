---
date: '2024-09-28 12:20'
title: '커버링 인덱스로 100만 건 데이터 환경에서 API 응답 속도 90% 개선하기'
tags: ['tech', '커버링 인덱스']
summary: '우아한테크코스 6기 프로젝트인 크루루에서 커버링 인덱스로 100만 건 데이터 환경에서 API 응답 속도를 90% 개선한 경험에 대해 소개합니다.'
thumbnail: './assets/covering-index.jpg'
---

# 커버링 인덱스로 100만 건 데이터 환경에서 API 응답 속도 90% 개선하기
안녕하세요, 우아한테크코스 6기에서 크루루 서비스의 개발을 맡고 있는 권기호입니다. [크루루 서비스](https://www.cruru.kr/)는 동아리나 소규모 집단을 위한 리크루팅 서비스로, 서비스의 성장을 대비하여 데이터베이스에 대량 데이터를 삽입하고 성능을 개선하는 작업을 진행하고 있습니다. 이번 글에서는 대량의 데이터 환경에서 API 응답 속도를 빠르게 처리하기 위한 방법과, 이를 해결하기 위해 커버링 인덱스를 적용하여 성능을 개선한 경험을 공유하려고 합니다.

## 예상 독자

1. API의 성능 병목 현상을 어떻게 접근하고 해결할지 고민하는 분들
2. 조인(Join)이 포함된 쿼리에서 성능 최적화를 고민하는 분들
3. N+1 문제와 지연 로딩(Lazy Loading)으로 인해 발생하는 비효율을 해결하려는 분들
4. MySQL에서 인덱스를 적용해 쿼리 성능을 개선하고자 하는 분들
5. 100만 건 이상의 데이터 처리 시 쿼리 개수 및 처리 시간을 줄이기 위한 최적화 방법을 찾고 계신 분들
6. 커버링 인덱스와 복합 인덱스가 실제 성능에 미치는 영향을 알고 싶은 분들

# 배경
팀 크루루는 서비스 확장을 염두에 두고, 대량의 데이터를 데이터베이스에 삽입하며 성능 개선 작업을 진행하고 있습니다. 이에 앞서 대규모 데이터 환경에서 성능을 최적화하기 위해 데이터 구성과 테스트 작업을 선행하였습니다.
## 선행 작업

테스트를 위해 다음과 같은 테이블 구성과 데이터 레코드를 준비했습니다.

| 테이블 | 레코드 수 | 참고 |
| --- | --- | --- |
| MEMBER | 500 | - |
| CLUB | 500 | - |
| DASHBOARD | 1,500 | Club 하나당 3개의 Dashboard |
| APPLYFORM | 1,500 | - |
| PROCESS | 6,000 | Dashboard 하나당 4개의 Process |
| APPLICANT | 200,000 | - |
| QUESTION | 7,500 | - |
| CHOICE | 15,000 | - |
| ANSWER | 1,000,000 | - |
| EVALUATION | 1,000,000 | - |

## 대량 데이터 삽입 방법
대규모 데이터 테스트를 위해 데이터를 대량으로 삽입하는 세 가지 방법을 고려했습니다.

### INSERT문을 통한 삽입
엑셀을 이용해 랜덤 데이터를 생성한 후, 이를 INSERT문으로 변환해 하나씩 데이터를 삽입하는 방식입니다. 엑셀의 랜덤 함수와 텍스트 결합 기능을 사용해 데이터를 생성할 수 있지만, 수작업으로 인한 비효율성과 대량 데이터 삽입 시 시간 소요가 매우 큽니다.
### Bulk INSERT 사용
Bulk INSERT는 여러 행의 데이터를 한 번에 삽입할 수 있는 방법으로, 매번 개별 INSERT문을 사용하는 것보다 성능 면에서 훨씬 효율적입니다. 그러나 대량 데이터를 다루기엔 여전히 비효율적일 수 있습니다.
### MySQL에서 LOAD DATA LOCAL INFILE 사용
MySQL의 LOAD DATA LOCAL INFILE 명령어는 CSV 파일을 매우 빠르게 임포트할 수 있는 방법입니다. 다른 방법에 비해 매우 빠르게 대량 데이터를 삽입할 수 있습니다.


위 세 가지 방법 중, LOAD DATA 명령어를 사용하여 CSV 파일을 임포트하는 방법을 선택하였고, 이를 통해 100만 건의 데이터를 6초만에 삽입했습니다.

# API 실행 시간 관측

Grafana를 사용해 API 실행 시간을 모니터링한 결과, 일부 API에서 1초 이상의 실행 시간이 관측되었습니다.

![image.png](https://github.com/user-attachments/assets/80826272-b0a8-4a84-b8e4-9987d9baabaf)

특히 `PATCH /v1/processes/{processes}`와 `GET /v1/processes` API를 개선할 필요가 있음을 확인했습니다.

---

# 쿼리 성능 개선

먼저 `GET /v1/processes` API에서 실행되는 쿼리를 분석했습니다.

해당 API는 Process, Applicant, Evaluation 등의 엔티티에서 데이터를 가져오며, 다음 ERD에서 그 구조를 확인할 수 있습니다.

![erdsimple.png](https://github.com/user-attachments/assets/a52cd920-3f34-484c-9b2c-569e690bd772)

다음은 `GET /v1/processes` API 호출 시, 실행되는 쿼리입니다.

```sql
select * from member m1_0 where m1_0.email=?
select d1_0.dashboard_id,d1_0.club_id from dashboard d1_0 where d1_0.dashboard_id=?
select * from club c1_0 where c1_0.club_id=?
select * from apply_form af1_0 where af1_0.dashboard_id=?
select * from process p1_0 where p1_0.dashboard_id=?
select * from applicant a1_0 where a1_0.process_id=?
select count(e1_0.evaluation_id) from evaluation e1_0 where e1_0.applicant_id=? and e1_0.process_id=?
select * from evaluation e1_0 where e1_0.process_id=? and e1_0.applicant_id=?
select count(e1_0.evaluation_id) from evaluation e1_0 where e1_0.applicant_id=? and e1_0.process_id=?
select * from evaluation e1_0 where e1_0.process_id=? and e1_0.applicant_id=?
// ...
select count(e1_0.evaluation_id) from evaluation e1_0 where e1_0.applicant_id=? and e1_0.process_id=?
select * from evaluation e1_0 where e1_0.process_id=? and e1_0.applicant_id=?
select count(e1_0.evaluation_id) from evaluation e1_0 where e1_0.applicant_id=? and e1_0.process_id=?
select * from evaluation e1_0 where e1_0.process_id=? and e1_0.applicant_id=?
```

총 200여 개의 쿼리가 실행되는 것을 확인했습니다. 모든 엔터티에서 지연 로딩(Lazy Loading)으로 인해 N+1 쿼리가 발생하고, count와 select 쿼리가 반복적으로 실행되었습니다.

우선 쿼리 개수를 줄이기보다 단건 조회 쿼리의 처리 속도를 개선하는 접근을 택했습니다. 쿼리 개수가 실제로 성능의 주요 병목인지 판단할 필요가 있었기 때문입니다. 또한, 쿼리 개수를 줄이려면 코드 변경이 필요하기에, 먼저 단건 조회 쿼리의 성능을 개선하여 코드 수정 없이도 병목을 해결할 수 있는지 확인하고자 했습니다.

## 인덱스를 적용하여 단건 조회 쿼리의 처리 속도 개선하기


200여 개의 쿼리 중 where에 걸린 조건을 분석한 결과, applicant_id와 process_id 칼럼에 복합 인덱스를 적용했습니다.

그러면 여기서 인덱스의 칼럼 순서는 어떻게 결정해야 할까요?

이를 알아보기 위해 (process_id, applicant_id) 인덱스와 (applicant_id, process_id) 인덱스를 생성하여 비교하였습니다.


![image](https://github.com/user-attachments/assets/0c2b1b8f-e661-4ab7-a976-7b48e932cd80)

### 인덱스 1. (process_id, applicant_id)

`(process_id, applicant_id)` 인덱스를 적용한 후 실행 계획을 살펴봅시다.


![image](https://github.com/user-attachments/assets/c60d92d2-6063-4faf-8ca3-3471279ebb74)

주목해야할 칼럼은 possible_keys입니다. possible_keys는 옵티마이저가 최적의 실행 계획을 수립하기 위해 고려한 여러 접근 방법 중에서 사용할 수 있는 인덱스들의 목록입니다 possible_keys가 NULL이기 때문에 옵티마이저가 어떠한 인덱스도 고려하지 않았다는 것을 알 수 있습니다.

따라서 해당 쿼리는 테이블을 처음부터 끝까지 읽는 Full Table Scan으로 실행됩니다.

### 인덱스 2. (applicant_id, process_id)

이번에는 `(applicant_id, process_id)` 인덱스를 적용하여 실행 계획을 살펴보겠습니다.

![image](https://github.com/user-attachments/assets/19c443fe-c650-4121-acd7-a983b96dcea9)

이전 실행 계획과는 다르게 type, key가 변경되었습니다. type이 ref로 변경되어 인덱스를 사용했으며, 여러 인덱스 중에서 저희가 생성한 `(applicant_id, process_id)` 인덱스를 사용하였음을 알 수 있습니다.

![image](https://github.com/user-attachments/assets/e2d2a4ae-f573-4e8e-bba1-bc1384ab2d97)

인덱스 적용 후, 실행 시간은 약 1초에서 350ms로 감소했습니다. 그러나 네트워크 속도를 제외한 시간이므로, 실제 성능은 더 개선이 필요했습니다.

따라서 최적화가 더 필요했고, 단일 쿼리 최적화로는 더 이상 속도를 줄이지 못한다고 판단했습니다.

## API 로직 튜닝

API 하나당 실행되는 쿼리 수를 줄이기 위해 로직을 수정했습니다.

이전 로직은 다음과 같습니다.

1. dashboardId로 process 조회
2. process마다 존재하는 applicant 조회 (N+1개의 쿼리 발생)
3. applicant마다 evaluation 평균 점수 조회

그림으로 표현하면 다음과 같습니다.

![logic.png](https://github.com/user-attachments/assets/40ec0bb2-973f-4e6c-bb09-07798f4fdf1d)

N+1 문제로 쿼리가 실행되고, 평균 점수를 반복해서 조회하기 때문에 쿼리의 개수가 기하급수적으로 증가합니다.

따라서 로직을 다음과 같이 수정했습니다.

1. 평균 점수 및 개수를 projection으로 변환
2. Fetch Join을 활용하여 process, applicant 테이블을 한번에 조회
3. IN 절을 사용해 여러 프로세스를 한 번에 조회

해당 로직으로 변경한 결과, 데이터의 수와 관계없이 `GET /v1/processes` API 요청 시 인가 쿼리 2개와 API 로직으로 발생하는 쿼리 4개로 처리할 수 있습니다.

```sql
-- 회원 정보 조회
select *
from 
    member m1_0 
where 
    m1_0.email = ?;

-- 대시보드 ID로 대시보드 조회
select 
    d1_0.dashboard_id, 
    d1_0.club_id 
from 
    dashboard d1_0 
where 
    d1_0.dashboard_id = ?;

-- 클럽 ID로 클럽 정보 조회
select *
from 
    club c1_0 
where 
    c1_0.club_id = ?;

-- 대시보드 ID로 신청서 조회
select 
    af1_0.apply_form_id, 
    af1_0.created_date, 
    d1_0.dashboard_id, 
    d1_0.club_id, 
    af1_0.description, 
    af1_0.end_date, 
    af1_0.start_date, 
    af1_0.title, 
    af1_0.updated_date 
from 
    apply_form af1_0 
    join dashboard d1_0 on d1_0.dashboard_id = af1_0.dashboard_id 
where 
    d1_0.dashboard_id = ?;

-- 대시보드 ID로 프로세스 정보 조회
select *
from 
    process p1_0 
    left join dashboard d1_0 on d1_0.dashboard_id = p1_0.dashboard_id 
where 
    d1_0.dashboard_id = ?;

-- 여러 프로세스 ID에 해당하는 지원자 정보 조회
select 
    a1_0.applicant_id, 
    a1_0.name, 
    a1_0.created_date, 
    a1_0.is_rejected, 
    count(e1_0.evaluation_id), 
    coalesce(avg(e1_0.score), 0.00), 
    a1_0.process_id 
from 
    applicant a1_0 
    left join evaluation e1_0 on e1_0.applicant_id = a1_0.applicant_id 
where 
    a1_0.process_id in (?,?,?,?) 
group by 
    a1_0.applicant_id, 
    a1_0.name, 
    a1_0.created_date, 
    a1_0.is_rejected, 
    a1_0.process_id; 
```

API 로직을 개선한 후에, 인덱스가 없는 API의 실행 시간을 살펴보면 약 700ms로 감소한 것을 확인할 수 있습니다.

![747ms](https://github.com/user-attachments/assets/71b06e7b-9343-4dc1-a356-5d021bf0c0ce)

그러나 API의 실행 시간은 여전히 만족스럽지 않습니다. API 로직으로 발생하는 4개의 쿼리 중 병목이 발생할 수 있는 GROUP BY 절과 JOIN 절이 있는 쿼리를 살펴봤습니다.

```sql
-- 여러 프로세스 ID에 해당하는 지원자 정보 조회
select 
    a1_0.applicant_id, 
    a1_0.name, 
    a1_0.created_date, 
    a1_0.is_rejected, 
    count(e1_0.evaluation_id), 
    coalesce(avg(e1_0.score), 0.00), 
    a1_0.process_id 
from 
    applicant a1_0 
    left join evaluation e1_0 on e1_0.applicant_id = a1_0.applicant_id 
where 
    a1_0.process_id in (?,?,?,?) 
group by 
    a1_0.applicant_id, 
    a1_0.name, 
    a1_0.created_date, 
    a1_0.is_rejected, 
    a1_0.process_id; 
```

해당 쿼리의 실행 계획은 아래와 같습니다.

![image](https://github.com/user-attachments/assets/b6885c5c-ba59-4bc9-928c-2e96fb6c0f84)


type이 ALL이기 때문에 Full Table Scan으로 실행되고, 어떠한 인덱스도 적용되지 않았습니다. 또한 rows 칼럼에서 994,125행을 스캔해야 한다고 예측하고 있습니다.

이어서 `EXPLAIN ANALYZE`를 실행한 결과를 살펴보겠습니다.


<aside>

💡 `EXPLAIN ANALYZE`는 SQL 쿼리 실행 계획을 분석하고, 실제 실행 시간을 포함한 성능 정보를 제공하는 명령어입니다. 이를 통해 쿼리 최적화에 필요한 정보를 파악할 수 있습니다.

</aside>


![image](https://github.com/user-attachments/assets/35139b2f-9634-4754-ad94-0715fc55d5e8)


1. Table scan on `e1_0`:  Evaluation 테이블에 대한 Full Table Scan을 진행합니다. 총 `994125`개의 행을 처리하고, 실제 실행 시간은 `0.0489ms`~ `331ms`입니다.
2. Index range scan on `a1_0` using `fk_applicant_to_process`:`fk_applicant_to_process` 인덱스를 사용한 범위 스캔입니다. 이는 효율적으로 인덱스를 사용하여 `process_id`가 `1, 2, 3, 4`인 항목을 스캔한 것입니다. 실제 실행 시간은 `0.0653ms`~ `0.382ms` 사이이며, `150`개의 행이 처리합니다.
3. Hash: 해시 작업이 수행된 것으로, 조인을 효율적으로 수행하기 위해 데이터를 해싱한 단계입니다.
4. Left hash join: 해시 조인 방식으로 Applicant 테이블과 Evaluation 테이블을 조인합니다. 실제 시간이 `503ms`에서 `685ms` 사이이며, `742`개의 행을 처리했습니다.
5. Aggregate using temporary table: 임시 테이블을 사용한 집계 작업을 수행합니다. SELECT에서 사용된 `count()`, `avg()` 를 처리합니다.
6. Table scan on `<temporary>`: 임시 테이블의 결과를 읽어서 반환합니다. 실제 처리된 시간은 `686ms`이며, `150`개의 행을 처리했습니다.

Evaluation 테이블에서 Full Table Scan이 발생하고 있어서 약 10만개의 row를 조회하고 있습니다.

따라서 Evaluation 테이블에 인덱스를 추가하고, 필요한 칼럼만을 조회할 수 있는 커버링 인덱스를 적용하면 성능을 더욱 높일 수 있을 것으로 판단했습니다.

<aside>

💡 커버링 인덱스(Covering Index)는 쿼리를 처리할 때, 인덱스만으로 필요한 모든 데이터를 조회할 수 있는 인덱스를 말합니다. 테이블의 데이터를 따로 읽지 않기 때문에 랜덤 I/O가 발생하지 않고 인덱스만으로 쿼리의 모든 요청을 처리할 수 있어 성능을 크게 향상시킬 수 있습니다.

</aside>


## 커버링 인덱스 유도하기

Evaluation 테이블에 일부 정보(applicant_id, evaluation_id, score)만을 인덱싱하여 인덱스를 생성했습니다.


![image](https://github.com/user-attachments/assets/9852c89c-c990-4600-adb4-8b04a31c9dcd)


실행 계획을 조금 더 자세히 분석 해봅시다.

![image](https://github.com/user-attachments/assets/618e35d7-6f09-4161-9c9a-4126435d6be3)


실행 계획이 이전과 달라진 것을 알 수 있습니다. 집중해서 볼 부분은 type, key, rows, Extra 칼럼입니다.

1. type(ALL → ref): 특정 인덱스를 사용하여 데이터가 조회됩니다.
2. rows(994125 → 4): 994,125개 행에서 4개의 row만 조회할 것으로 예상됩니다. 인덱스를 사용하여 필요한 행만 조회함으로써 성능이 크게 개선되었습니다.
3. Extra(Using where; Using join buffer → Using index): 추가적인 조건 없이 인덱스 자체로 데이터를 찾아냅니다.


![image](https://github.com/user-attachments/assets/07122181-572c-42b9-8e0f-8ad65e09c663)

`EXPLAIN ANALYZE`의 결과에서 실제로 커버링 인덱스가 유도됨을 알 수 있습니다.


# 쿼리 성능 개선 결과

평균 API 실행 시간이 900ms에서 101ms로 최적화되었습니다.


![image](https://github.com/user-attachments/assets/7e98c668-39f1-4a47-9c3e-ef31d922a2a7)

# 결론

이번 프로젝트에서 커버링 인덱스를 활용해 대규모 데이터 환경에서 API 응답 속도를 90% 이상 개선한 과정을 살펴보았습니다. 인덱스 최적화를 통해 쿼리 실행 속도가 비약적으로 향상되었고, MySQL에서 발생하는 쿼리 성능 문제를 효과적으로 해결할 수 있었습니다. 특히, 커버링 인덱스를 적절히 적용한 쿼리는 디스크 접근을 줄이고, 필요한 데이터만 효율적으로 조회할 수 있게 했습니다.

물론 커버링 인덱스가 모든 상황에서 만능 해결책은 아닙니다. 그러나 저희 팀처럼 대규모 데이터 환경에서 빠른 API 응답이 중요한 경우에는 유용한 도구가 될 수 있습니다. 이번 경험을 통해 성능 병목을 발견했고, 인덱스 최적화로 이를 해결할 수 있음을 확인했습니다.

저희 팀은 앞으로도 성능을 개선하기 위해 다양한 접근 방식을 시도할 계획입니다. 더 많은 인사이트와 경험이 궁금하시다면 [크루루 팀 블로그](https://blog.cruru.kr/)에서 확인해 보실 수 있습니다. 이번 성과처럼 좋은 결과를 낼 수 있는 기회가 생긴다면, 다시 한번 경험을 공유할 수 있기를 기대합니다.