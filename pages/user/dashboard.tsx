import React, {useContext, useEffect, useState} from "react";
import {client, hostedFields} from "braintree-web"
import Axios from "axios";
import {Props, UserContext} from "../../components/userContext/user-context";

const Dashboard: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const {userState} = useContext<Props>(UserContext)
    const [payment_methods, setPaymentMethods] = useState([])
    const [error, setError] = useState<string[]>()
    const [alert, setAlert] = useState(false);

    useEffect(() => {
        getToken().then(token => instance(token))
    }, [])

    useEffect(() => {

        if (alert === false) {
            return
        } else {
            console.log('alert effect')
            setTimeout(() => {
                setAlert(false);
            }, 3000);
        }
    }, [alert]);

    const getToken = async () => {
        const headers = JSON.parse(localStorage.getItem('J-tockAuth-Storage'))
        const response = await Axios.get(`http://127.0.0.1:4000/${process.env.NEXT_PUBLIC_STATION_ID}/payment_methods/client_token`)
        const payment_res = await Axios.get(`http://127.0.0.1:4000/api/${process.env.NEXT_PUBLIC_STATION_ID}/subscribers/${userState.user['id']}/payment_methods`,
            {
                params: {
                    uid: headers['uid'],
                    client: headers['client'],
                    "access-token": headers["access-token"]
                }
            })
        setPaymentMethods(payment_res.data)
        return response.data.client_token
    }

    const instance = (token: string) => {
        client.create({
            authorization: token
        }, (err, clientInstance) => {
            if (err) {
                console.error(err);
                return;
            }
            createHostedFields(clientInstance);
        });
    }

    const createHostedFields = (clientInstance) => {
        hostedFields.create({
            client: clientInstance,
            styles: {
                'input': {
                    'font-size': '16px',
                    'font-family': 'courier, monospace',
                    'font-weight': 'lighter',
                    'color': '#ccc'
                },
                ':focus': {
                    'color': '#FFF'
                },
                '.valid': {
                    'color': '#8bdda8'
                },
                '.invalid': {
                    'color': '#e00737'
                }
            },
            fields: {
                number: {
                    selector: '#card-number',
                    placeholder: '4111 1111 1111 1111'
                },
                cvv: {
                    selector: '#cvv',
                    placeholder: '123'
                },
                expirationDate: {
                    selector: '#expiration-date',
                    placeholder: 'MM/YYYY'
                },
            }
        }, (err, hostedFieldsInstance) => {
            const form = document.querySelector('#cardForm');
            const tokenize = (event) => {
                event.preventDefault();
                hostedFieldsInstance?.tokenize(function (err, payload) {
                    if (err) {
                        err.details?.invalidFieldKeys?.length >= 1 && err.details.invalidFieldKeys.forEach(key => hostedFieldsInstance.clear(key))
                        setError(err.details?.invalidFieldKeys)
                        return;
                    }
                    handleSubmit(payload.nonce).then(r => console.log(r))
                    hostedFieldsInstance.clear('number');
                    hostedFieldsInstance.clear('cvv');
                    hostedFieldsInstance.clear('expirationDate');
                });

            };
            form.addEventListener('submit', tokenize, false);
        });
    }

    const handleSubmit = async (nonce: string) => {
        setLoading(true)
        const headers = JSON.parse(localStorage.getItem('J-tockAuth-Storage'))

        if (payment_methods.length > 0) {
            await Axios.put(`http://127.0.0.1:4000/api/${process.env.NEXT_PUBLIC_STATION_ID}/subscribers/${userState.user['id']}/subscription/${payment_methods[0]['token']}/edit_payment_method`,
                {
                    nonce_from_the_client: nonce,
                    uid: headers['uid'],
                    client: headers['client'],
                    "access-token": headers["access-token"]
                })
            setLoading(false)
        } else {
            await Axios.post(`http://127.0.0.1:4000/api/${process.env.NEXT_PUBLIC_STATION_ID}/subscribers/3/payment_methods`,
                {
                    nonce_from_the_client: nonce,
                    uid: headers['uid'],
                    client: headers['client'],
                    "access-token": headers["access-token"]
                })
            setLoading(false)
        }
        setAlert(true)
    }
    return (
        <div className="w-full grid place-items-center mt-10">
            <div className="p-2 card bg-08dp shadow-md">
                <div className="form-control card-body">
                    <div className="text-center text-3xl font-bold card-title">Your Account</div>
                    <div className="grid grid-cols-2 mx-10">
                        <div className="card shadow-2xl lg:card-side bg-12dp text-primary-content">
                            <div className="card-body">
                                <p className="text-xl">Payment Method</p>
                                <form id="cardForm">
                                    <label htmlFor="card-number"
                                           className={error?.includes('number') ? 'text-error' : ''}>
                                        Card Number</label>
                                    <div id="card-number" className="hosted-field mt-3"/>
                                    <label htmlFor="expiration-date"
                                           className={error?.includes('expirationDate') ? 'text-error' : ''}>
                                        Expiration Date</label>
                                    <div id="expiration-date" className="hosted-field mt-3"/>
                                    <label htmlFor="expiration-date"
                                           className={error?.includes('cvv') ? 'text-error' : ''}>CVV</label>
                                    <div id="cvv" className="hosted-field mt-3"/>
                                    <div className='text-center mt-3'>
                                        {alert &&
                                        <div className="alert alert-success fixed my-auto">
                                            <div className="flex-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#2196f3"
                                                     className="w-6 h-6 mx-2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                                </svg>
                                                <label>Success!</label>
                                            </div>
                                        </div>
                                        }
                                        <button className={loading ? "btn btn-primary loading" : "btn btn-primary"}
                                                type='submit'>
                                            {payment_methods.length > 0 ? 'Update' : 'Create'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Dashboard