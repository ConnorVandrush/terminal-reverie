export default function ColorCharacterComponent() {
  return (
    <div>
      <div>
        <label htmlFor="hairColor">Hair Color:</label>
        <select id="hairColor">
          <option value="blackHair">Black</option>
          <option value="blondeHair">Blonde</option>
          <option value="brownHair">Brown</option>
          <option value="greyHair">Grey</option>
          <option value="redHair">Red</option>
        </select>
      </div>

      <div>
        <label htmlFor="eyeColor">Eye Color:</label>
        <select id="eyeColor">
          <option value="blueEyes">Blue</option>
          <option value="brownEyes">Brown</option>
          <option value="darkBrownEyes">Dark Brown</option>
          <option value="greenEyes">Green</option>
        </select>
      </div>

      <div>
        <label htmlFor="skinColor">Skin Tone:</label>
        <select id="skinColor">
          <option value="fairSkin">Fair</option>
          <option value="richSkin">Rich</option>
          <option value="rosySkin">Rosy</option>
          <option value="tanSkin">Tan</option>
        </select>
      </div>

      <div>
        <label htmlFor="shirtColor">Shirt Color:</label>
        <select id="shirtColor">
          <option value="blueShirt">Blue</option>
          <option value="greenShirt">Green</option>
          <option value="redShirt">Red</option>
        </select>
      </div>

      <div>
        <label htmlFor="pantsColor">Pants Color:</label>
        <select id="pantsColor">
          <option value="bluePants">Blue</option>
          <option value="greenPants">Green</option>
          <option value="redPants">Red</option>
        </select>
      </div>

      <div>
        <button type="button" id="randomizeAppearanceButton">
          Randomize Appearance
        </button>
      </div>

      <div>
        <button type="button" id="createCharacterButton">
          Create Character
        </button>
      </div>
    </div>
  );
}
