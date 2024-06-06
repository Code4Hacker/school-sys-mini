export const ModuleModal = {
    getModulesData() {
        return [
            {
                sn: '1',
                category: 'Web  Development',
                name: 'JAVA Programming',
                session: 'Afternoon',
                venue: 'LRB 004D',
                lab: "Not allocated",
                capacity: 45,
                act1: 24
            },
            {
                sn: '2',
                category: 'Multimedia and Graphics',
                name: 'Game Development',
                session: 'Morning',
                venue: 'LRB 104',
                lab: "Not allocated",
                capacity: 145,
                act1: 4
            },
            {
                sn: '3',
                category: 'Web  Development',
                name: 'Web Technology',
                session: 'Afternoon',
                venue: 'LRB 004D',
                lab: "Not allocated",
                capacity: 45,
                act1: 2
            },
            {
                sn: '4',
                category: 'Web  Development',
                name: 'Mobile Applications (Android App Dev)',
                session: 'Afternoon',
                venue: 'LRB 105',
                lab: "Not allocated",
                capacity: 55,
                act1: 30
            },
            
        ];
    },

    getModulesMini() {
        return Promise.resolve(this.getModulesData().slice(0, 5));
    },

    getModulesSmall() {
        return Promise.resolve(this.getModulesData().slice(0, 10));
    },

    getModules() {
        return Promise.resolve(this.getModulesData());
    },

    getModulesWithOrdersSmall() {
        return Promise.resolve(this.getModulesWithOrdersData().slice(0, 10));
    },

    getModulesWithOrders() {
        return Promise.resolve(this.getModulesWithOrdersData());
    }
};

