import React from "react";

interface StorySubmissionProps {
    imageMap: Map<string, any>,
    players: Map<string, string>,
    avatar: string
    storyState: string,
    waitingFor: string[],
    playerName: string,
    entry: string,
    updateEntry: (e: React.ChangeEvent<HTMLInputElement>) => void,
    handleSubmit: () => void,
}

export function StorySubmission(props: StorySubmissionProps) {

    function getPlayerImage(player: string) {
        if (props.players.get(player)) {
            return props.imageMap.get(props.players.get(player) as string)
        }
    }

    return (
        <div className="form-group custom input">
            <img className="avatar" src={props.imageMap.get(props.avatar)}/>
            <label className="label title">{props.storyState}</label>
            {props.waitingFor.includes(props.playerName) ?
                <>
                    <input type="text" className="form-control separated" value={props.entry}
                           onChange={props.updateEntry}/>
                    <button className="btn btn-primary separated" onClick={props.handleSubmit}>Submit</button>
                </>
                : <label className="label info">Submitted</label>
            }
            <br/>
            <div className="waiting-div">
                {props.waitingFor.map((player: string) =>
                    <div className="waiting-avatar">
                        <label className="label warning">{player}</label>
                        <img className="avatar waiting" src={getPlayerImage(player)}/>
                        <br/>
                    </div>
                )}
            </div>
        </div>
    )
}