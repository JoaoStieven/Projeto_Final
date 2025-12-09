import { existsSync, readFileSync } from "node:fs";
export function useTemplate(file, parameters) {
    if (!existsSync(file))
        throw new Error("Invalid template file path");
    const baseTemplate = readFileSync(file, { encoding: "utf-8" });
    const subbed = baseTemplate.replace(/{{(.+?)}}/g, (_, token) => {
        if (typeof token !== "string")
            throw new Error("Oof");
        const trimedToken = token.trim();
        if (!/:/.test(trimedToken)) {
            return escape(parameters[trimedToken]);
        }
        const [paramName, tag] = trimedToken.split(":").map(segment => segment.trim());
        if (/\[\]$/.test(tag)) {
            const trueTag = tag.replace("[]", "");
            return HtmlTags["ul"](arraySub(trueTag)(parameters[paramName].map(escape)));
        }
        ;
        if (/\{.+?\}$/.test(tag)) {
            const trueTag = tag.replace(/\{.+?\}/, "");
            const props = tag.match(/\{(.+?)\}/)[1].split(";").map(pair => pair.split("="));
            return propertySub(trueTag, parameters[paramName], props);
        }
        return HtmlTags[tag](escape(parameters[paramName]));
    });
    return subbed;
}
const HtmlTags = {
    li: (content) => `<li>${content}</li>`,
    p: (content) => `<p>${content}</p>`,
    b: (content) => `<b>${content}</b>`,
    ul: (content) => `<ul>${content}</ul>`
};
function arraySub(tag) {
    return (content) => content.map(e => HtmlTags[tag](e)).join("\n");
}
function propertySub(tag, content, props) {
    const baseContent = HtmlTags[tag](content);
    const strProps = props.map(([name, value]) => `${escape(name)}="${escape(value)}"`).join(" ");
    return baseContent.replace(">", " " + strProps + ">");
}
function escape(content) {
    return content.replace(/(<|>|"|')/g, (_, token) => {
        token = token.trim();
        switch (token) {
            case "<": return "&gt";
            case ">": return "&lt";
            case "&": return "&amp";
            case "\"": return "&quot";
            case "\'": return "&#39";
            default: throw new Error("Won't happen");
        }
    });
}
