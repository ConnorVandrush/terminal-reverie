import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import styles from './CreateCharacter.module.css';
import { setName, setOrigin, setJob, setGender, setHairStyle, setClothingStyle, newSpriteTemplate } from '@store/createCharacterSlice';

export default function CreateCharacter()
{
    const dispatch = useDispatch();
    
    const name = useSelector((state) => state.createCharacter.name);
    const origin = useSelector((state) => state.createCharacter.origin);
    const job = useSelector((state) => state.createCharacter.job);
    const gender = useSelector((state) => state.createCharacter.gender);
    const hairStyle = useSelector((state) => state.createCharacter.hairStyle);
    const clothingStyle = useSelector((state) => state.createCharacter.clothingStyle);

    const handleNewSpriteTemplate = (e) =>
    {
        switch (e.target.name)
        {
            case "origin":
                dispatch(setOrigin(e.target.value));
                break;
            case "job":
                dispatch(setJob(e.target.value));
                break;
            case "gender":
                dispatch(setGender(e.target.value));
                break;
            case "hairStyle":
                dispatch(setHairStyle(e.target.value));
                break;
            case "clothingStyle":
                dispatch(setClothingStyle(e.target.value));
                break;
            default:
                break;
        }
        dispatch(newSpriteTemplate());
    };
   
    return (
        <div className={styles.createCharacter}>
            <div className={styles.createCharacterForm}>
            <h3>Create Character</h3>

                <div>
                    <label htmlFor="characterName">Character Name:</label>
                    <input type="text" id="characterName" name="characterName" value={name} className={styles.input} onChange={(e) => dispatch(setName(e.target.value))} />
                </div>


                <div>
                    <label htmlFor="origin">Origin:</label><br />
                    <select id="origin" name="origin" value={origin} className={styles.input} onChange={handleNewSpriteTemplate}>
                        <option value="grasslands">Grasslands</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="job">Job:</label><br />
                    <select id="job" name="job" value={job} className={styles.input} onChange={handleNewSpriteTemplate}>
                        <option value="warrior">Warrior</option>
                        <option value="mage">Mage</option>
                        <option value="rogue">Rogue</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="gender">Gender:</label><br />
                    <select id="gender" name="gender" value={gender} className={styles.input} onChange={handleNewSpriteTemplate}>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="hairStyle">Hair Style:</label><br />
                    <select id="hairStyle" name="hairStyle" value={hairStyle} className={styles.input} onChange={handleNewSpriteTemplate}>
                        <option value="hair1">Style 1</option>
                        <option value="hair2">Style 2</option>
                        <option value="hair3">Style 3</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="clothingStyle">Clothing Style:</label><br />
                    <select id="clothingStyle" name="clothingStyle" value={clothingStyle} className={styles.input} onChange={handleNewSpriteTemplate}>
                        <option value="style1">Style 1</option>
                        <option value="style2">Style 2</option>
                        <option value="style3">Style 3</option>
                    </select>
                </div>

            </div>
        </div>
    );
}