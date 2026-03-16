import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import styles from './ColorCharacter.module.css';
import { setHairColor, recolorHair, setEyeColor, setSkinColor, setShirtColor, setPantsColor } from '@store/createCharacterSlice';

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

    const handleRecolorHair = (e) =>
    {
        const hairColor = e.target.value;
        dispatch(setHairColor(hairColor));
        dispatch(recolorHair());
    };

    return (
        <div className={styles.colorCharacter}>
            <div className={styles.colorCharacterForm}>

                <div>
                    <label htmlFor="hairColor">Hair Color:</label>
                    <select id="hairColor" name="hairColor" value={hairColor} className={styles.input} onChange={handleRecolorHair}>
                        <option value="blonde">Blonde</option>
                        <option value="brown">Brown</option>
                        <option value="black">Black</option>
                        <option value="red">Red</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="eyeColor">Eye Color:</label>
                    <select id="eyeColor" name="eyeColor" value={eyeColor} className={styles.input} onChange={(e) => dispatch(setEyeColor(e.target.value))}>
                        <option value="blue">Blue</option>
                        <option value="green">Green</option>
                        <option value="brown">Brown</option>
                    </select>
                </div>
                
                <div>
                    <label htmlFor="skinColor">Skin Color:</label>
                    <select id="skinColor" name="skinColor" value={skinColor} className={styles.input} onChange={(e) => dispatch(setSkinColor(e.target.value))}>
                        <option value="rosy">Rosy</option>
                        <option value="fair">Fair</option>
                        <option value="tan">Tan</option>
                        <option value="rich">Rich</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="shirtColor">Shirt Color:</label>
                    <select id="shirtColor" name="shirtColor" value={shirtColor} className={styles.input} onChange={(e) => dispatch(setShirtColor(e.target.value))}>
                        <option value="blue">Blue</option>
                        <option value="green">Green</option>
                        <option value="red">Red</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="pantsColor">Pants Color:</label>
                    <select id="pantsColor" name="pantsColor" value={pantsColor} className={styles.input} onChange={(e) => dispatch(setPantsColor(e.target.value))}>
                        <option value="blue">Blue</option>
                        <option value="green">Green</option>
                        <option value="red">Red</option>
                    </select>
                </div>

                <button type="button" id="createCharacterButton" onClick={handleCreateCharacter} >Create Character</button>

            </div>
        </div>
    )
};

