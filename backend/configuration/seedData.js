const UserRoles = require("../Interface/UserRoles");

const seedData = {
    "user": [
        {
            "sys_id": '5e20e429-7c16-49c5-b5c7-98b8a7f4d756',
            "full_name": 'Abnet Kebede',
            "active": true,
            "phone": '0943337884',
            "password": '$2b$10$XAFiXUCbxDeXBvpWZT6Ssus3yWv3qQO/KFdiI79tLxItLpQo0oJzG'

        },
        {
            "sys_id": 'e3136470-7370-4d94-a012-8c8edca900ce',
            "full_name": 'System User',
            "active": true,
            "phone": '0930376854',
            "password": '$2b$10$TV0is3ao5/EJxC26ccp1seYuaFWnW.6gUplXAL7qHkpFqaQZm6xDO'
        }
    ],
    "userrole": [
        {
            "role": 'admin',
            "user_id": '5e20e429-7c16-49c5-b5c7-98b8a7f4d756',
            "active": true,
            "created_by": '5e20e429-7c16-49c5-b5c7-98b8a7f4d756',
            "updated_by": '5e20e429-7c16-49c5-b5c7-98b8a7f4d756'
        }
    ],
    "choice": [
        {
            "label": 'Administrator',
            "id": 'userRole.role',
            "value": 'admin',
            "color": '#060400',
            "bgColor": '#0604004d',
            "created_by": '5e20e429-7c16-49c5-b5c7-98b8a7f4d756',
            "updated_by": '5e20e429-7c16-49c5-b5c7-98b8a7f4d756'
        }
    ]

};

module.exports = seedData;