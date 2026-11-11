import { getLangs } from "../langs";
import InstallButtonClient from "./InstallButtonClient";

export default async function InstallButton({ lang }) {
    const dict = (await getLangs(lang)).common;

    return <InstallButtonClient dict={dict} />;
}