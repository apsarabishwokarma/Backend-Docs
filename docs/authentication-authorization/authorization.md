## Authorization Basics

- Authorization is the process of determining what actions a user or system is allowed to perform after they have been authenticated.
- It ensures that users can only access resources and perform actions that they have permission for.
- In web applications, authorization is typically implemented using roles, permissions, or access control lists (ACLs).

### Common Authorization Methods

- Role-Based Access Control (RBAC): Users are assigned roles, and each role has specific permissions. For example, an "admin" role might have permissions to create, read, update, and delete resources, while a "user" role might only have permission to read resources.
- Attribute-Based Access Control (ABAC): Access decisions are based on attributes of the user, the resource, and the environment. For example, a user might only be allowed to access a resource during certain hours or from specific locations.
- Access Control Lists (ACLs): A list of permissions is associated with each resource, specifying which users or groups have access to it and what actions they can perform.
- OAuth 2.0: A widely used authorization framework that allows third-party applications to access resources on behalf of a user without sharing their credentials. It uses access tokens and refresh tokens to manage authorization.

### Difference between Authentication and Authorization

| Aspect  | Authentication                                               | Authorization                                                                        |
| ------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| Purpose | Verifying the identity of a user or system                   | Determining what actions a user or system is allowed to perform after authentication |
| Process | Involves verifying credentials (e.g., username and password) | Involves checking permissions and access rights based on roles, attributes, or ACLs  |
| Outcome | Grants access to the system if credentials are valid         | Grants access to specific resources or actions based on permissions                  |
| Focus   | Identity verification                                        | Access control and permissions management                                            |
| Example | Logging in to a website using a username and password        | Accessing an admin dashboard that requires specific permissions                      |
