



function UserImageAvatar(userName) {
    const username =  userName ? userName.substring(0, 2).toUpperCase() : '';

    return (
    <>
     <div className="initials-placeholder">{username}</div>
    </>
    );
}

export default UserImageAvatar;