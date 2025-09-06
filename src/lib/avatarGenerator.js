// Avatar-Generator für konfigurierte Personas
export const generatePersonaImage = (gender, ageGroup) => {
  // Kuratierte und verifizierte Profilbilder von Unsplash
  const photos = {
    male: {
      young_adults: [
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1463453091185-61582044d556?w=300&h=300&fit=crop&crop=face"
      ],
      adults: [
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1612214070475-1e73f478188c?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1557862921-37829c7de6cc?w=300&h=300&fit=crop&crop=face"
      ],
      middle_age: [
        "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1559553156-2e97137af16f?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1556474688-479399155327?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1516729557019-1891456f956e?w=300&h=300&fit=crop&crop=face"
      ],
      senior: [
        "https://images.unsplash.com/photo-1581087724822-f4e70a896577?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=300&h=300&fit=crop&crop=face"
      ],
      elderly: [
        "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=300&fit=crop&crop=face"
      ]
    },
    female: {
      young_adults: [
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&h=300&fit=crop&crop=face"
      ],
      adults: [
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face"
      ],
      middle_age: [
        "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1569931727762-93dd90109eef?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=face"
      ],
      senior: [
        "https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1582233479366-6d38bc390a08?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1559570188-a0c3a32d4fd7?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1590086782957-93c06ef21604?w=300&h=300&fit=crop&crop=face"
      ],
      elderly: [
        "https://images.unsplash.com/photo-1442458370899-ae20e367c5d8?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1559570188-a0c3a32d4fd7?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1590086782957-93c06ef21604?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=300&h=300&fit=crop&crop=face"
      ]
    }
  };

  // Fallback für den Fall, dass die Kategorie nicht existiert
  const fallbackPhotos = {
    male: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    female: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face"
  };

  try {
    // Wähle ein zufälliges Foto aus der korrekten Kategorie
    const categoryPhotos = photos[gender]?.[ageGroup];
    if (categoryPhotos && categoryPhotos.length > 0) {
      return categoryPhotos[Math.floor(Math.random() * categoryPhotos.length)];
    } else {
      // Fallback auf Geschlecht, wenn Altersgruppe nicht verfügbar
      return fallbackPhotos[gender] || fallbackPhotos.male;
    }
  } catch (error) {
    console.warn('Fehler beim Laden des Persona-Bildes:', error);
    // Allgemeiner Fallback
    return fallbackPhotos[gender] || fallbackPhotos.male;
  }
};