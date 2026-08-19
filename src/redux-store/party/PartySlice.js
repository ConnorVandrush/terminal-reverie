import { createSlice } from "@reduxjs/toolkit";

const PartySlice = createSlice({
  name: "PartySlice",
  initialState: {
    createCharacterName: "",
    createCharacterAppearance: {},
    characterSpriteDesign: {},
    characterSpritePreview: null,
    partyLeaderCharacterId: null,
    partyMembers: [null, null, null, null],
    partyInvites: {},
    errorMessage: "",
    successMessage: "",
  },
  reducers: {
    setPartyLeaderCharacterId(state, action) {
      state.partyLeaderCharacterId = action.payload;
    },
    setErrorMessage(state, action) {
      state.successMessage = "";
      state.errorMessage = action.payload;
    },
    setSuccessMessage(state, action) {
      state.errorMessage = "";
      state.successMessage = action.payload;
    },
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
    setPartyMemberCharacterData(state, action) {
      const { memberIndex, characterData } = action.payload;

      state.partyMembers[memberIndex] = characterData;
    },
    serverDeliverPartyInvite(state, action) {
      state.partyInvites[action.payload.senderId] = action.payload.senderName;
    },
    removePartyInvite(state, action) {
      delete state.partyInvites[action.payload];
    },
    clientSendPartyInvite(state, action) {
      //emit handled in PartySliceEmitters
    },
    clientAcceptPartyInvite(state, action) {
      //emit handled in PartySliceEmitters
    },
    clientLeaveParty(state, action) {
      //emit handled in PartySliceEitters
    },
    setPlayerHp(state, action) {
      const { playerIndex, currentHp } = action.payload;

      if (state.partyMembers[playerIndex]) {
        state.partyMembers[playerIndex].currentHp = currentHp;
      }
    },
  },
});

export const {
  setCreateCharacterName,
  setCreateCharacterAppearance,
  setCharacterSpriteDesign,
  randomizeCharacterSpriteDesign,
  setCharacterSpritePreview,
  setPartyMemberCharacterData,
  addPartyInvite,
  removePartyInvite,
  clientSendPartyInvite,
  setErrorMessage,
  setSuccessMessage,
  setPartyLeaderCharacterId,
  serverDeliverPartyInvite,
  clientAcceptPartyInvite,
  clientLeaveParty,
  setPlayerHp,
} = PartySlice.actions;
export default PartySlice.reducer;
