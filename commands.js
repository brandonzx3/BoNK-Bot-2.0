module.exports = function(bot, prefix) {
    let commands = [];
    function generate_usage(command) {
        var output = "Usage: "+prefix+command.name;
        command.args.forEach(arg => {
            output += " <"+arg.name+": ";
            let display_type = arg.type;
            switch (display_type) {
                case "string": display_type = `"Text"`; break;
            }
            output += display_type + ">"
        });
        return output;
    }
    bot.on("message", message => {
        for (let i = 0; i < commands.length; i++) {
            let command = commands[i], prefix_length = prefix.length + command.name.length;
            if (message.content.slice(0, prefix_length) === prefix + command.name) {
                let raw_args = message.content.slice(prefix_length).split(" ").slice(1);
                let args = [], args_index = 0, success = true;
                for (let i = 0; i < command.args.length; i++) {
                    let arg = command.args[i];
                    if (args_index >= raw_args.length) {
                        message.channel.send(`You did not provide ${arg.name}\n${generate_usage(command)}`);
                        success = false; break;
                    }
                    switch (arg.type) {
                        case "word":
                            args.push(raw_args[args_index]); args_index++;
                            break;
                        case "number":
                            let possible_number = parseInt(raw_args[args_index]);
                            args_index++;
                            if (isNaN(possible_number)) {
                                message.channel.send(`${arg.name} is not a number\n${generate_usage(command)}`);
                                success = false; break;
                            }
                            args.push(possible_number); break;
                        case "string":
                            if (raw_args[args_index].slice(0,1) !== '"') {
                                args.push(raw_args[i]); args_index++;
                                break;
                            }
                            let start = args_index;
                            while (raw_args[args_index].slice(-1) !== '"') {
                                args_index++; if (args_index >= raw_args.length) {
                                    message.channel.send(`You didn't end the quotation of ${arg.name}\n${generate_usage(command)}`);
                                    success = false; break;
                                }
                            }
                            if (!success) break;
                            console.log([start, args_index + 1]);
                            let joined = raw_args.slice(start, args_index + 1).join(" ");
                            args.push(joined.slice(1, joined.length - 1));
                            args_index++; break;
                    }
                    if (!success) return;
                }
                let call_args = args.concat([message, command]);
                command.run.apply(null, call_args);
                return;
            }
        }
    });
    return function(name) {
        this.run = arguments[arguments.length - 1];
        this.args = Array.prototype.slice.call(arguments, 1, arguments.length - 1);
        this.name = name;
        commands.push(this);
    }
}