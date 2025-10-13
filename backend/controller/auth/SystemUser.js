const UserRoles = require("../../Interface/UserRoles");

const SystemUser = {
    sys_id: "e3136470-7370-4d94-a012-8c8edca900ce",
    Id: "e3136470-7370-4d94-a012-8c8edca900ce",
    Roles: [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.Sells],
    "full_name": "System User",
    "phone": "0930376854",
    "active": true,
    "password": "$2b$10$XAFiXUCbxDeXBvpWZT6Ssus3yWv3qQO/KFdiI79tLxItLpQo0oJzG",
    "created_on": "2025-02-20T19:00:00.000Z",
    "updated_on": "2025-02-28T08:08:05.098Z",
    "created_by": "5e20e429-7c16-49c5-b5c7-98b8a7f4d756",
    "updated_by": "5e20e429-7c16-49c5-b5c7-98b8a7f4d756"
};

module.exports = SystemUser;