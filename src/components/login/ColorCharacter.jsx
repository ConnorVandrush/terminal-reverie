import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import styles from './ColorCharacter.module.css';
import { setHairColor, recolorSprite, setEyeColor, setSkinColor, setShirtColor, setPantsColor } from '@store/createCharacterSlice';

export default function ColorCharacter()
{
    const dispatch = useDispatch();

    const hairColor = useSelector((state) => state.createCharacter.hairColor);
    const eyeColor = useSelector((state) => state.createCharacter.eyeColor);
    const skinColor = useSelector((state) => state.createCharacter.skinColor);
    const shirtColor = useSelector((state) => state.createCharacter.shirtColor);
    const pantsColor = useSelector((state) => state.createCharacter.pantsColor);

    const handleCreateCharacter = () => 
    {
        // Implementation for creating character
    };

    const handleRecolorSprite = (e) =>
    {
        let option;
        switch (e.target.name)
        {
            case "hairColor":
                dispatch(setHairColor(e.target.value));
                option = "hair";
                break;
            case "eyeColor":
                dispatch(setEyeColor(e.target.value));
                option = "eyes";
                break;
            case "skinColor":
                dispatch(setSkinColor(e.target.value));
                option = "skin";
                break;
            case "shirtColor":
                dispatch(setShirtColor(e.target.value));
                option = "shirt";
                break;
            case "pantsColor":
                dispatch(setPantsColor(e.target.value));
                option = "pants";
                break;
            default:
                break;
        }
        dispatch(recolorSprite(option));
    };

    return (
        <div className={styles.colorCharacter}>
            <div className={styles.colorCharacterForm}>

                <div>
                    <label htmlFor="hairColor">Hair Color:</label>
                    <select id="hairColor" name="hairColor" value={hairColor} className={styles.input} onChange={handleRecolorSprite}>
                        <option value="blondeHair">Blonde</option>
                        <option value="blackHair">Black</option>
                        <option value="brownHair">Brown</option>
                        <option value="redHair">Red</option>
                        <option value="greyHair">Grey</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="eyeColor">Eye Color:</label>
                    <select id="eyeColor" name="eyeColor" value={eyeColor} className={styles.input} onChange={handleRecolorSprite}>
                        <option value="blueEyes">Blue</option>
                        <option value="darkBrownEyes">Dark Brown</option>
                        <option value="brownEyes">Brown</option>
                        <option value="greenEyes">Green</option>
                    </select>
                </div>
                
                <div>
                    <label htmlFor="skinColor">Skin Color:</label>
                    <select id="skinColor" name="skinColor" value={skinColor} className={styles.input} onChange={handleRecolorSprite}>
                        <option value="rosySkin">Rosy</option>
                        <option value="richSkin">Rich</option>
                        <option value="tanSkin">Tan</option>
                        <option value="fairSkin">Fair</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="shirtColor">Shirt Color:</label>
                    <select id="shirtColor" name="shirtColor" value={shirtColor} className={styles.input} onChange={handleRecolorSprite}>
                        <option value="greenShirt">Green</option>
                        <option value="redShirt">Red</option>
                        <option value="blueShirt">Blue</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="pantsColor">Pants Color:</label>
                    <select id="pantsColor" name="pantsColor" value={pantsColor} className={styles.input} onChange={handleRecolorSprite}>
                        <option value="greenPants">Green</option>
                        <option value="redPants">Red</option>
                        <option value="bluePants">Blue</option>
                    </select>
                </div>

                <button type="button" id="createCharacterButton" onClick={handleCreateCharacter} >Create Character</button>

            </div>
        </div>
    )
};

