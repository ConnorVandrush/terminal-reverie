import { createSlice } from "@reduxjs/toolkit";

const PartySlice = createSlice({
  name: "PartySlice",
  initialState: {
    createCharacterName: "",
    createCharacterAppearance: {},
    characterSpriteDesign: {},
    characterSpritePreview: null,
    partyMember1: false,
    partyMember2: false,
    partyMember3: false,
    partyMember4: false,
    partyInvites: {},
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
      state.partyMember1 = action.payload;
    },
    setMember1CharacterLocation(state, action) {
      state.partyMember1.location = action.payload;
    },
    setMember2CharacterData(state, action) {
      state.partyMember2 = action.payload;
    },
    setMember3CharacterData(state, action) {
      state.partyMember3 = action.payload;
    },
    setMember4CharacterData(state, action) {
      state.partyMember4 = action.payload;
    },
    addPartyInvite(state, action) {
      state.partyInvites[action.payload.characterId] = action.payload.name;
    },
    removePartyInvite(state, action) {
      delete state.partyInvites[action.payload];
    },
    clientSendPartyInvite(state, action) {
      //emit handled in PartySliceEmitters
    },
  },
});

export const {
  setCreateCharacterName,
  setCreateCharacterAppearance,
  setCharacterSpriteDesign,
  randomizeCharacterSpriteDesign,
  setCharacterSpritePreview,
  setMember1CharacterData,
  setMember1CharacterLocation,
  setMember2CharacterData,
  setMember3CharacterData,
  setMember4CharacterData,
  addPartyInvite,
  removePartyInvite,
  clientSendPartyInvite,
} = PartySlice.actions;
export default PartySlice.reducer;
