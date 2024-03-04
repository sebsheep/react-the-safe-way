import { Lang } from "./Lang";

export type Item = { kind: ItemKind; price: number; name: string; id: string };

type ItemKind = "bike" | "scooter" | "shoes";

function translateKind(kind: ItemKind, lang: Lang): string {
  switch (lang) {
    case "EN":
      return kind;
    case "FR":
      switch (kind) {
        case "bike":
          return "vélo";
        case "scooter":
          return "trottinette";
        case "shoes":
          return "chaussures";
      }
  }
}

export function Item(props: { item: Item; lang: Lang }) {
  return (
    <>
      <h2>{props.item.name}</h2>
      <i>{translateKind(props.item.kind, props.lang)}</i>
      <strong></strong>
    </>
  );
}
