import { useEffect, useRef, useState } from "react";
import { APIService } from "../../service/API.service";
import type { IPositions } from "../../interface/position.interface";
import style from "./Form.module.scss";

interface IErrors {
    [key: string]: string[];
}

interface FormProps {
    refreshUsers: () => Promise<void>;
}

const Form: React.FC<FormProps> = ({ refreshUsers }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [positionId, setPositionId] = useState<number | null>(null);
    const [positions, setPositions] = useState<IPositions>({ positions: [] });
    const [photo, setPhoto] = useState<File | null>(null);

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<IErrors>({});
    const [message, setMessage] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const fetchPositions = async () => {
        try {
            const data = await APIService.GetPositions();
            setPositions(data);
        } catch (e) {
            console.error("Ошибка загрузки позиций", e);
        }
    };

    useEffect(() => {
        fetchPositions();
    }, []);

    const validate = () => {
        const errs: IErrors = {};

        if (name.length < 2 || name.length > 60) {
            errs.name = ["Name must be 2-60 characters"];
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errs.email = ["Email must be valid"];
        }

        if (!phone.startsWith("+380")) {
            errs.phone = ["Phone must start with +380"];
        }

        if (!positionId) {
            errs.position_id = ["Position is required"];
        }

        if (!photo) {
            errs.photo = ["Photo is required"];
        } else {
            if (photo.size > 5 * 1024 * 1024) {
                errs.photo = ["Photo must not exceed 5MB"];
            }
        }

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        setErrors({});
        setMessage(null);

        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("email", email);
            formData.append("phone", phone);
            formData.append("position_id", String(positionId));
            if (photo) {
                formData.append("photo", photo);
            }

            await APIService.PostUser(formData);

            setName("");
            setEmail("");
            setPhone("");
            setPositionId(null);
            setPhoto(null);
            setMessage("User created successfully!");
            await refreshUsers();
        } catch (e) {
            if (e.response?.data?.fails) {
                setErrors(e.response.data.fails);
            } else if (e.response?.data?.message) {
                setMessage(e.response.data.message);
            } else {
                setMessage("Unexpected error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={style.form}>
            <input
                className={style.input}
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            {errors.name && <span className="error">{errors.name[0]}</span>}

            <input
                className={style.input}
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            {errors.email && <span className="error">{errors.email[0]}</span>}

            <div className={style.phone}>
                <input
                    className={style.input}
                    type="text"
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                />
                <span>+38 (XXX) XXX - XX - XX</span>
            </div>
            {errors.phone && <span className="error">{errors.phone[0]}</span>}

            <div className={style.position}>
                <span>Select your position</span>
                {positions.positions.map((pos) => (
                    <label key={pos.id}>
                        <input
                            type="radio"
                            name="position"
                            value={pos.id}
                            checked={positionId === pos.id}
                            onChange={() => setPositionId(pos.id)}
                        />
                        <span>{pos.name}</span>
                    </label>
                ))}
            </div>
            {errors.position_id && (
                <span className="error">{errors.position_id[0]}</span>
            )}

            <div className={style.photo}>
                <label>
                    <button type="button"
                        onClick={() => fileInputRef.current?.click()}>Upload</button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg"
                        style={{ display: "none" }}
                        onChange={(e) =>
                            setPhoto(e.target.files ? e.target.files[0] : null)
                        }
                    />
                </label>
                <div className={style.photo_name}>
                    <span>{photo ? photo.name : "Upload your photo"}</span>
                </div>
            </div>
            {errors.photo && <span className="error">{errors.photo[0]}</span>}

            <button className={style.button} type="submit" disabled={loading}>
                {loading ? "Loading..." : "Sign up"}
            </button>

            {message && <div className="message">{message}</div>}
        </form>
    );
};

export default Form;

