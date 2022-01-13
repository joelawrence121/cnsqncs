from enum import Enum


class GameMode(Enum):
    CLASSIC = "classic"
    EXTENDED = "extended"
    FRESH = "fresh"


class StoryState(Enum):
    NOT_STARTED = "<ready to start>"
    MAN = "(man's name)"
    WOMAN = "met (woman's name)"
    MET = 'in / at'
    TO = 'to'
    HE_WORE = 'he wore'
    SHE_WORE = 'she wore'
    HE_SAID = 'he said'
    SHE_SAID = 'she said'
    HE_DID = 'he (did)'
    SHE_DID = 'she (did)'
    CONSEQUENCE = 'and the consequence was'
    FINISHED = "<finished>"


CLASSIC_SEQUENCE = [
    StoryState.NOT_STARTED,
    StoryState.MAN,
    StoryState.WOMAN,
    StoryState.MET,
    StoryState.HE_WORE,
    StoryState.SHE_WORE,
    StoryState.HE_SAID,
    StoryState.SHE_SAID,
    StoryState.CONSEQUENCE,
    StoryState.FINISHED
]

EXTENDED_SEQUENCE = [
    StoryState.NOT_STARTED,
    StoryState.MAN,
    StoryState.WOMAN,
    StoryState.MET,
    StoryState.TO,
    StoryState.HE_WORE,
    StoryState.SHE_WORE,
    StoryState.HE_SAID,
    StoryState.SHE_SAID,
    StoryState.HE_DID,
    StoryState.SHE_DID,
    StoryState.CONSEQUENCE,
    StoryState.FINISHED
]


def create_sequence(mode: GameMode):
    if mode == GameMode.CLASSIC.value:
        return CLASSIC_SEQUENCE
    elif mode == GameMode.EXTENDED.value:
        return EXTENDED_SEQUENCE
    return CLASSIC_SEQUENCE
