import { ListenForCommands } from "./actions.mjs";
import { EstablishSlashCommands } from "./commands.mjs";

await EstablishSlashCommands();

ListenForCommands();