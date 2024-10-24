# TaskLeafs Backend

TaskLeaf's is a mock project management app, that works on a workplace>branches>leafs>tasks hierarchy. The app is made with reactJS, TypeScript (vanilla CSS) for the frontend, and Express and MongoDB(with mongoose) on the backend.
Link to [Frontend Repo](https://github.com/ahsan-rigu/taskleafs-frontend)

Note: Branches, Leafs and tasks are created at the front-end first (to make the creation instant) and require an \_id key in the form of mongo object id, do this on the frontend by using mongoose (or by just mimicking the pattern making sure you don't create dublicates).
Note: If you see a requirement like task or leaf or branch, assume it's an object and check models for specific requirements.

Requires auth means `` req.headers = {authorization : `Bearer ${token}`} ``

## User Routes (including auth)

### Sign Up [post]

```
api/user/sign-up
req.body = {name, username, password}
```

### Sign In [post]

```
api/user/sign-in
req.body = {username, password}
```

### Verify[post]

```
api/user/authorize-token
req.headers = {authorization : `Bearer ${token}`}
```

### Get User Data [get]

```
api/user/
req.headers = {authorization : `Bearer ${token}`}
```

## Workplace Routes (requires auth)

### Create Workplace [post]

```
api/workplace/
{ name, description } = req.body;
```

### Delete Workplace [delete]

```
api/workplace/:workplaceId
```

Only Workplace Owners Can Delte Workplaces

### Update Workplace [put]

```
api/workplace/
{ workplaceId, workplaceName, description } = req.body;
```

Only Workplace Owners Can Update Workplaces

### Invite Member [put]

```
api/workplace/invite
{ username, workplaceId } = req.body
```

Only Workplace Owners Can Invite Members

### Decline Invite [put]

```
api/workplace/decline
{ workplaceId, workplaceName } = req.body;
```

### Accept Invite [put]

```
api/workplace/accept
{ workplaceId, workplaceName } = req.body;
```

Finds the user accepting the invite using auth

### Remove User [delete]

```
api/workplace/member/:workplaceId/:removeUserId
```

Only Workplace Owners Or Users that are bering removed can remove user

## Branch Routes (requires auth)

### Create Branch [post]

```
api/branch
const {  branch, workplaceId } = req.body
```

### Delete Branch [delete]

```
api/branch/:workplaceId/:branchId
```

### Update Branch Name [put]

```
api/branch/
const { branchId, branchName } = req.body
```

## Leaf Routes (requires auth)

### Create Leaf [post]

```
api/leaf/
const { branchId, leaf } = req.body
```

### Delete Leaf [delete]

```
api/leaf/:branchId/:leafId"
```

### Update Leaf Name [put]

```
api/leaf/
{ leafId, leafName } = req.body
```

### Add Task [post]

```
api/leaf/task
{ task, leafId } = req.body
```

### Delete Task [delete]

```
api/leaf/task/:leafId/:taskId
```

### Update Task [put]

```
api/leaf/task
{ task, leafId } = req.body
```

### Move Task [put]

```
api/leaf/task/move
const { startLeaf, finishLeaf } = req.body;
```

Unfortunate but you need the entirety of the leaf it started at and the one it ended at.
