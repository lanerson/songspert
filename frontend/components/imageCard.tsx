import '../styles/imageCard.css'
const avatars = ['bear',
    'cat',
    'chicken',
    'dinosaur',
    'dog',
    'gorilla',
    'meerkat',
    'panda',
    'rabbit']

type avatarProps = {
    visible: boolean,
    onClick: (avatar) => void
}

export default function ImageCard({ visible, onClick }: avatarProps) {
    return (
        <div className='avatar-parent' onClick={() => onClick("")} style={{ display: (visible) ? 'flex' : 'none' }}>

            <div className="avatar-container" >
                {avatars.map(avatar => <div key={avatar} className="avatar-content" onClick={() => onClick(avatar)}
                    style={{ backgroundImage: `url("/images/avatar/${avatar}.png")` }} />)}
            </div>
        </div >

    )
}