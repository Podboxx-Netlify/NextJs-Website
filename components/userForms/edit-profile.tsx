import React, {useContext, useEffect, useState} from "react";
import {Props, UserContext} from "../userContext/user-context";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faSave} from '@fortawesome/free-solid-svg-icons';
import {ErrorNotification, SuccessNotification} from "../notification";
import Axios from "axios";
import {mutate} from "swr";
import validator from 'validator';

export default function EditProfile(props) {
    const [error, setError] = useState<string[]>([])
    const {userState, userDispatch} = useContext<Props>(UserContext)
    const [formData, setFormData] = useState({...props.data})
    const [editProfile, setEditProfile] = useState<boolean>(false)

    useEffect(() => {
        setFormData(props.data)
    }, [props.data])

    const handleChange = (id: string, value: string) => {
        setFormData(data => ({...data, [id]: value}))
    }

    const updateProfile = async () => {
        const headers = JSON.parse(localStorage.getItem('J-tockAuth-Storage'))
        if (verifyData()) return
        userDispatch({type: 'LOADING'})
        await Axios.put(`${process.env.NEXT_PUBLIC_API_URL}${userState.channel}/subscribers/auth`,
            {
                email: formData.email,
                first_name: formData.first_name,
                last_name: formData.last_name,
            }, {
                headers: {
                    uid: headers['uid'],
                    client: headers['client'],
                    "access-token": headers["access-token"]
                }
            })
            .then(() => SuccessNotification(userDispatch, 'Your profile was successfully updated!'))
            .catch(() => ErrorNotification(userDispatch, 'There was an error updating your profile'))
            .then(() => mutate(`${process.env.NEXT_PUBLIC_API_URL}${userState.channel}/subscribers/profile`))
    }

    const verifyData = () => {
        let errors = []
        !validator.isEmail(formData.email) && errors.push('Email is invalid.')
        !validator.isAlpha(formData.first_name) && errors.push('First name cannot have numbers.')
        !validator.isAlpha(formData.last_name) && errors.push('Last name cannot have numbers.')
        validator.isEmpty(formData.first_name) && errors.push('First name cannot be empty.')
        validator.isEmpty(formData.last_name) && errors.push('Last name cannot be empty.')
        setError(errors)
        return errors.length > 0;
    }

    return (
        <div className="grid grid-cols-2">
            <div className='col-span-2'>
                {error.length > 0 &&
                error.map((e => <p key={e} className='w-full text-error whitespace-pre-line text-center'>{e}&nbsp;</p>
                ))}
            </div>
            <div className='col-span-1 mr-1'>
                <label className="label">
                    <span className="label-text">First Name</span>
                </label>
                <input className="input bg-32dp form-control"
                       name="first_name" id="first_name" disabled={!editProfile}
                       onChange={e => handleChange('first_name', e.target.value)}
                       value={formData?.first_name || ''}/>
            </div>
            <div className='col-span-1 ml-1'>
                <label className="label">
                    <span className="label-text">Last Name</span>
                </label>
                <input className="input bg-32dp form-control"
                       name="last_name" id="last_name" disabled={!editProfile}
                       onChange={e => handleChange('last_name', e.target.value)}
                       value={formData?.last_name || ''}/>
            </div>
            <div className='col-span-2'>
                <label className="label">
                    <span className="label-text">Email</span>
                </label>
                <input
                    className="input bg-32dp w-full form-control"
                    name="email" id="email" disabled={!editProfile}
                    onChange={e => handleChange('email', e.target.value)}
                    value={formData?.email || ''}/>
            </div>
            <div className='col-span-1 mr-1'/>
            <div className="form-control justify-center mt-9 text-center ml-1">
                {editProfile ?
                    <button type="submit" className="btn btn-outline" onClick={() => updateProfile()}>
                        <FontAwesomeIcon icon={faSave} className='mr-2'/>
                        Submit
                    </button> :
                    <button className="btn btn-outline" onClick={() => setEditProfile(!editProfile)}>
                        <FontAwesomeIcon icon={faEdit} className='mr-2'/>
                        Edit Profile
                    </button>
                }
            </div>
        </div>
    )
}