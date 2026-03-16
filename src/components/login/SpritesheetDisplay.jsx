import React from "react";
import { useSelector } from "react-redux";

import styles from "./SpritesheetDisplay.module.css";

export default function SpritesheetDisplay()
{
    const img = useSelector(state => state.createCharacter.img);

    return (
        <img
            src={img ?? "/img/characters/$Grasslander.png"}
            alt="Spritesheet"
            className={styles.spritesheetImage}
        />
    );
}