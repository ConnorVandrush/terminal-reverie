import { createSlice } from "@reduxjs/toolkit";

const PartySlice = createSlice({
  name: "PartySlice",
  initialState: {
    createCharacterName: "",
    createCharacterAppearance: {},
    characterSpriteDesign: {},
    characterSpritePreview: null,
    member1CharacterData: {},
    member2CharacterData: {},
    member3CharacterData: {},
    member4CharacterData: {},
  },
  reducers: {
    setCreateCharacterName(state, action) {
      state.createCharacterName = action.payload;
    },
    setCreateCharacterAppearance(state, action) {
      state.createCharacterAppearance = action.payload;
    },
    setCharacterSpriteDesign(state, action) {
      state.characterSpriteDesign = action.payload;
    },
    randomizeCharacterSpriteDesign(state, action) {
      const ORIGINS = ["Plains"];
      const SEX = ["Female", "Male"];
      const HAIRSTYLE = ["Hair1", "Hair2"];
      const CLOTHINGSTYLE = ["Clothing1"];
      const HAIRCOLOR = [
        "blackHair",
        "blondeHair",
        "brownHair",
        "greyHair",
        "redHair",
      ];
      const EYECOLOR = ["blueEyes", "brownEyes", "darkBrownEyes", "greenEyes"];
      const SKINTONE = ["fairSkin", "richSkin", "rosySkin", "tanSkin"];
      const CLOTHINGCOLOR = ["blueClothing", "greenClothing", "redClothing"];

      const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

      state.characterSpriteDesign = {
        ...state.characterSpriteDesign,
        origin: rand(ORIGINS),
        sex: rand(SEX),
        hairStyle: rand(HAIRSTYLE),
        clothingStyle: rand(CLOTHINGSTYLE),
        hairColor: rand(HAIRCOLOR),
        eyeColor: rand(EYECOLOR),
        skinTone: rand(SKINTONE),
        clothingColor: rand(CLOTHINGCOLOR),
      };
    },
    setCharacterSpritePreview(state, action) {
      state.characterSpritePreview = action.payload;
    },
    setMember1CharacterData(state, action) {
      state.member1CharacterData = action.payload;
    },
    setMember2CharacterData(state, action) {
      state.member2CharacterData = action.payload;
    },
    setMember3CharacterData(state, action) {
      state.member3CharacterData = action.payload;
    },
    setMember4CharacterData(state, action) {
      state.member4CharacterData = action.payload;
    },
    updateCharacterCreatorAppearance(state, action) {},
  },
});

export const {
  setCreateCharacterName,
  setCreateCharacterAppearance,
  setCharacterSpriteDesign,
  randomizeCharacterSpriteDesign,
  setCharacterSpritePreview,
  setMember1CharacterData,
  setMember2CharacterData,
  setMember3CharacterData,
  setMember4CharacterData,
} = PartySlice.actions;
export default PartySlice.reducer;
