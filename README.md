# Incident-Management-Project
This project showcases an Incident Management Application imitating JIRA or service now as a learning step for NodeJS, Angular and even a little about DevOps hopefully

## Main Idea and Use Case
Simple rendition of a ServiceNow type application. Three types of Roles:
- Admin [ Assigns Other Roles, See all Incidents, Create Incidents ]
- Manager [ See the Incidents Related to his team/or others, Assign it to Employees ]
- Employee [ View Incidents, assign them to others, Reply to it as well ]

>Let's start with a bottom up approach, think about what needs to be provided to the user based on their roles and build functionalities based on that!

- #### 1. The Employee
    The Employee can see the incidents that his team has and also check his own incidents, change their status, assign them to somebody else, add to the incident.
    > Key takeaways: An employee needs to be part of a team and have a manager, the incidents have a set of conversations that are updated Live. Every update in coversation has to be emailed.

- #### 2. The Manager
    The manager will be able to apply different filters and view all incidets, reply to any and all, update their statuses. Very Similar to the Employee.

- #### 3. The Admin
    Can see all incidents from all teams, will be able to create incidents, grant other roles. Escalate incidents.
    > Key takeaway: Additional APIs for the same, Able to create but only by the admin


## DataBase

- Incidents(id, title, description, Conversation, team, employee_assigned_id, status, attachments, severity, end_date, start_date)
- Users(Id, role, manager, team, password)

## Backend

- Services for Incidents and Users, with CRUD instrumentation along with login/registring for users.
- Roles can only be given with admin credentials
- Passwords will be hashed and stored with salts for additional security and apis will be controlled by JWT and RBAC
- Conversations between them should be stored(need to finalise how...)
- The types will be inferred using Zod
- Backend should be able to do all operations perfectly without involving frontend first. Incidents should be able to close

## Frontend

- Pages:
    - Incident Page(with components so its reuseable)
    - Role based actions available
    - List pages (with components so different roles see different actionable items)
    - Login/Register Pages with special page for admin to be able to grant access to other users
    - include searches to make use of all of angular features efficiently 

## DevOps

- Implement Pipelines using github actions to provide safe coding practices and learn more about them

