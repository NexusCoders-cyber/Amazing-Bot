import bankCommand from './bank.js';

export default {
    name: 'withdraw',
    aliases: ['with', 'wd'],
    category: 'economy',
    description: 'Withdraw coins from your bank.',
    usage: 'withdraw <amount|all|half>',
    example: 'withdraw 500',
    cooldown: 3,
    permissions: ['user'],

    async execute(ctx) {
        ctx.args = ['withdraw', ...ctx.args];
        return bankCommand.execute(ctx);
    }
};
