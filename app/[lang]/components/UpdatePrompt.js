import { getLangs } from "../langs";
import UpdatePromptClient from "./UpdatePromptClient";

export default async function UpdatePrompt({ lang }) {
    const dict = (await getLangs(lang)).common;

    return <UpdatePromptClient dict={dict} />;
}