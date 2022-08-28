


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faGithub} from "@fortawesome/free-brands-svg-icons";

const AboutPage: React.FC = () => {

    return (
        <div className="section about">
            <h1>Consequences</h1>
            <p>To play consequences, be in a room with a group of friends.
                Each player enters a response to a prompt on their device.
                At the end, stories are stitched together from these responses which you get to read.
            </p>
            <div className="links-container">
                <b>Get in touch or contribute :)</b><br/>
                <a href="https://github.com/joelawrence121/cnsqncs" className="link">
                    <FontAwesomeIcon icon={faGithub} size="4x" color={"black"} />
                </a>
            </div>
        </div>
    );
}

export default AboutPage;