import React, {useState} from 'react';
import images from "../avatars/images";

interface HomeScreenProps {
    avatar: string
    setAvatar: (avatar: string) => void
    playerName: string
    updatePlayerName: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleCreateMenu: () => void
    handleJoin: () => void
}

function HomeScreen(props: HomeScreenProps) {

    const MOBILE_WIDTH = 400
    const [imageList] = useState(getRandomSubarray(images, 12))
    const [innerWidth] = useState(window.innerWidth)

    function getImage(value: any, isMobile: boolean) {
        let avatarClass = isMobile ? 'avatar_mobile' : 'avatar'
        if (props.avatar === value.toUpperCase()) {
            return <img className={avatarClass + " selected fadein"}  src={value} onClick={() => props.setAvatar(value.toUpperCase())}/>
        }
        return <img className={avatarClass + " selectable fadein"} src={value} onClick={() => props.setAvatar(value.toUpperCase())}/>
    }

    function getRandomSubarray(array: any[], size: number) {
        let shuffled = array.slice(0), i = array.length, min = i - size, temp, index;
        while (i-- > min) {
            index = Math.floor((i + 1) * Math.random());
            temp = shuffled[index];
            shuffled[index] = shuffled[i];
            shuffled[i] = temp;
        }
        return shuffled.slice(min);
    }

    function getAvatarRows(innerWidth : number) {
        const isMobile = innerWidth <= MOBILE_WIDTH
        const perRow = isMobile ? 3 : 4
        return <>
            <div className="avatars">{imageList.slice(0, perRow).map(value => getImage(value, isMobile))}</div>
            <br/>
            <div className="avatars">{imageList.slice(perRow, perRow * 2).map(value => getImage(value, isMobile))}</div>
            <br/>
            <div className="avatars">{imageList.slice(perRow * 2, perRow * 3).map(value => getImage(value, isMobile))}</div>
            <br/>
        </>
    }

    return (
        <div className="form-group custom">
            {getAvatarRows(innerWidth)}
            <input type="text" className="form-control separated" placeholder="Name"
                   value={props.playerName}
                   onChange={props.updatePlayerName}
            />
            <button className="btn btn-primary separated" onClick={props.handleCreateMenu}>Create</button>
            <button className="btn btn-primary separated" onClick={props.handleJoin}>Join</button>
        </div>
    );
}

export default HomeScreen;
