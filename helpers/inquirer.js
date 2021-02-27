const inquirer = require('inquirer');
require('colors');

const inquirerMenu = async() => {
    const questions = [
        {
            type: 'list',
            name: 'opt',
            message: 'What would you like to do?',
            choices: [
                { value: 1, name: `${'1'.green}.- Search place`},
                { value: 2, name: `${'2'.green}.- History`},
                { value: 0, name: `${'0'.green}.- Exit`}
            ],
        }
    ];
    
    console.clear();
    console.log('============================'.green);
    console.log('   Select an option'.white);
    console.log('============================\n'.green);

    const { opt } = await inquirer.prompt(questions);

    return opt;
}

const pause = async() => {
    const question = [
        { 
            type: 'input',
            name: 'ENTER',
            message: `Press ${ 'ENTER'.blue } to continue`,
        }
    ];

    console.log('\n');

    await inquirer.prompt(question);
}

const readInput = async(message) => {
    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate(value) {
                if (value.length === 0) {
                    return 'Please, enter a value'.red;
                }
                return true;
            }
        }
    ];

    const { desc } = await inquirer.prompt(question);

    return desc;
}

const listPlaces = async( places = []) => {
    const choices = places.map((place, i) => {
        const idx = `${ i + 1 }`.green;

        return {
            value: place.id,
            name: `${ idx.green }.- ${ place.name }`,
        }
    });

    choices.unshift({
        value: 0,
        name: '0.-'.green + ' Cancel'
    });

    const questions = [
        {
            type: 'list',
            name: 'id',
            message: 'Select a place',
            choices,
        }
    ];

    const { id } = await inquirer.prompt(questions);

    return id;
}


const listTaskForComplete = async(tasks = []) => {
    const choices = tasks.map((task, i) => {
        const idx = `${ i + 1 }`.green;

        return {
            value: task.id,
            name: `${ idx.green }.- ${ task.desc }`,
            checked: (task.completedOn) ? true : false,
        }
    });

    const questions = [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Select task(s) you want to complete',
            choices,
        }
    ];

    const { ids } = await inquirer.prompt(questions);

    return ids;
}

const confirm = async(question) => {
    const confirmQuestion = [
        {
            type: 'confirm',
            name: 'isConfirmed',
            message: question,
        }
    ];

    const { isConfirmed } = await inquirer.prompt(confirmQuestion);

    return isConfirmed;
}

module.exports = { 
    inquirerMenu, 
    pause, 
    readInput,
    listPlaces,
    listTaskForComplete,
    confirm, 
};