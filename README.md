## Project Title - YOGA-Application
```
# Problem Statement:
Assume that you are the CTO of an outsourcing firm which has been chosen to build an
admission form for the Yoga Classes which happen every month.
Requirements for the admission form are:
- Only people within the age limit of 18-65 can enroll for the monthly classes and they will
be paying the fees on a month on month basis. I.e. an individual will have to pay the fees
every month and he can pay it any time of the month.
- They can enroll any day but they will have to pay for the entire month. The monthly fee is
500/- Rs INR.
- There are a total of 4 batches a day namely 6-7AM, 7-8AM, 8-9AM and 5-6PM. The
participants can choose any batch in a month and can move to any other batch next
month. I.e. participants can shift from one batch to another in different months but in the
same month they need to be in the same batch.
```
## <a href="https://friendly-otter-bb2f96.netlify.app/">Click here for Demo </a>

# Features
```
- User can create account.
- User details while sign up will be validated
- User can subscribe a plan.
- A Mock Function for Payment is implemented.
- Once Subscribed can't changed the plan for whole month.
```

# Technology Used
- React for Frontend
- Node and Express for backend
- Mysql as a Database 


# ER Daigram 
![ER](https://github.com/Ritesh512/yogaFrontend/assets/89989932/fc32877b-be62-43e7-9d29-dc1dc48d4659)
- The Application has two Entities user and userplan.
- UserPlan has Partial Participation as one can have user account but not subscribe to any batch/plan.
- Email id is Primary Key where as Valid till is derived attribute. 


# Results
| Title | Image    |
--- | --- | 
| Dashboard |<img width="960" alt="SS-1" src="https://github.com/Ritesh512/yogaFrontend/assets/89989932/7bbcaa8c-cd3f-4dd0-9f3d-58bc875cfcec">|
| User Details Before any Plan |<img width="960" alt="SS-1" src="https://github.com/Ritesh512/yogaFrontend/assets/89989932/d3caefc1-6f0b-414b-9d98-8007acdad004">|
| Payment Page |<img width="960" alt="SS-4" src="https://github.com/Ritesh512/yogaFrontend/assets/89989932/2b49ed7e-a025-48b0-89d1-bd8d0bca4498">|
| After Registration |<img width="960" alt="SS-4" src="https://github.com/Ritesh512/yogaFrontend/assets/89989932/284cf8fe-f91c-4a00-9ae7-891f761c1ae7">|
| User Detail After any Plan |<img width="959" alt="SS-2" src="https://github.com/Ritesh512/yogaFrontend/assets/89989932/7efe2991-440a-48c3-83bf-fe7ef8ac45ac">|
| Registration Page |<img width="960" alt="SS-3" src="https://github.com/Ritesh512/yogaFrontend/assets/89989932/81d68cf2-e3de-4334-886c-964d2dc26c2e">|
| Login Page |<img width="960" alt="SS-3" src="https://github.com/Ritesh512/yogaFrontend/assets/89989932/e71771c0-5af1-45d7-8798-d740044f751a">|

# <a href="https://github.com/Ritesh512/yogaFrontend">Frontend Code </a>
