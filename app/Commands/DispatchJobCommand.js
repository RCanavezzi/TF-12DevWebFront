
import FirstJob from '../Jobs/FirstJob.js';

export default {

    name: 'job',

    description: 'Job test',

    arguments: {
        rollback: "boolean"
    },

    async handle() {

        await FirstJob.dispatchSocket({ info: 'Dispatched to all!' },);
    }
}   