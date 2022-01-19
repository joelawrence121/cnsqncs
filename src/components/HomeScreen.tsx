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

    const [imageList] = useState(getRandomSubarray(images, 12))

    function getImage(value: any) {
        if (props.avatar === value.toUpperCase()) {
            return <img className="avatar selected" src={value} onClick={() => props.setAvatar(value.toUpperCase())}/>
        }
        return <img className="avatar selectable" src={value} onClick={() => props.setAvatar(value.toUpperCase())}/>
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

    return (
        <div className="form-group custom">
            <div className="avatars">{imageList.slice(0, 4).map(value => getImage(value))}</div>
            <br/>
            <div className="avatars">{imageList.slice(4, 8).map(value => getImage(value))}</div>
            <br/>
            <div className="avatars">{imageList.slice(8, 12).map(value => getImage(value))}</div>
            <br/>
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
