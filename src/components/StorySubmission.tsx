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

    function getButton(entry: string) {
        if (entry && entry.length > 0) {
            return <button className="btn btn-primary separated fadein" onClick={props.handleSubmit}>Submit</button>
        }
    }

    function getWaitingList(waitingFor: string[]){
        if (waitingFor.includes(props.playerName)) {
            return <>
                <input type="text" className="form-control separated" value={props.entry}
                       onChange={props.updateEntry}/>
                {getButton(props.entry)}
            </>
        }
        if (!props.imageMap) return <></>
        return <label className="label anonymous">Submitted</label>
    }

    return (
        <div className="form-group custom input">
            <img className="avatar" src={props.imageMap.get(props.avatar)}/><br/>
            <label className="h3 title">{props.storyState}</label>
            {getWaitingList(props.waitingFor)}
            <br/>
            <div className="waiting-div">
                {props.waitingFor.map((player: string) =>
                    <div className="waiting-avatar">
                        <img className="avatar waiting" src={getPlayerImage(player)}/>
                        <label className="waiting_label warning waiting">{player}</label>
                        <br/>
                    </div>
                )}
            </div>
        </div>
    )
}