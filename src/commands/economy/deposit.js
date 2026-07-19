import bankCommand from './bank.js';

export default {
    name: 'deposit',
    aliases: ['dep'],
    category: 'economy',
    description: 'Deposit coins into your bank.',
    usage: 'deposit <amount|all|half>',
    example: 'deposit 1000',
    cooldown: 3,
    permissions: ['user'],

    async execute(ctx) {
        ctx.args = ['deposit', ...ctx.args];
        return bankCommand.execute(ctx);
    }
};
