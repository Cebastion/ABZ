import type { IUser } from "../../interface/user.interface"
import style from './User.module.scss'

const User = (User: IUser) => {
    return (
        <div className={style.block}>
            <img className={style.image} src={User.photo} alt={User.name} />
            <div className={style.name}>
                <span className={style.nameText}>{User.name}</span>
            </div>
            <div>
                <span className={style.positionText}>{User.position}</span>
            </div>
            <div>
                <span className={style.emailText}>{User.email}</span>
            </div>
            <div>
                <span className={style.phoneText}>{User.phone}</span>
            </div>
        </div>
    )
}


export default User
