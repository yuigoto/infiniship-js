import Infiniship from "lib";
import "./main.scss";
const inf = new Infiniship(false);
const image = inf.generateShipSpriteSheet(16, 16);
const main = document.querySelector<HTMLDivElement>("#main")!;
main.append(image);
