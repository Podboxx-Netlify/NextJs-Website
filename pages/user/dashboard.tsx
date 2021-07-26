import React, {useContext, useEffect, useState} from "react";
import {client, hostedFields} from "braintree-web"
import Axios from "axios";
import {Props, UserContext} from "../../components/userContext/user-context";
import {useRouter} from "next/router";
// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//     console.log(ctx.req)
//     const isLogged = await ctx.req.headers['isLogged'];
//
//     if(!isLogged){
//         return{
//             redirect:{
//                 destination: '/user/login', //usually the login page
//                 permanent: false,
//             }
//         }
//     }
//
//     return{
//         props: {
//             authenticated: true
//         }
//     }
//
//     // return { props: { logged: false } }
// }

interface CustomerInfo {
    payment_methods: {
        expiration_month: string
        expiration_year: string
        image_url: string
        number: string
        payment_type: string
        token: string
    }[]
    customer: {}

}

const Dashboard: React.FC = () => {
    const router = useRouter();
    const [alert, setAlert] = useState(false);
    const [error, setError] = useState<string[]>()
    const [loading, setLoading] = useState<boolean>(false)
    const {userState, userDispatch} = useContext<Props>(UserContext)
    const [customerInfo, setCustomerInfo] = useState<CustomerInfo>()
    const [channelPlans, setChannelPlans] = useState([])

    console.log(channelPlans, customerInfo)
    useEffect(() => {
        if (!userState.isLogged) {
            router.push('/user/login');
        } else if (userState.isLogged) {
            listChannelPlans().then(() => getToken().then(token => instance(token)));
        }
    }, [userState.isLogged])

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
        const response = userState.channel !== null && await Axios.get(`${process.env.NEXT_PUBLIC_URL}${userState.channel}/payment/client_token`)
        const payment_res = userState.channel !== null && await Axios.get(`${process.env.NEXT_PUBLIC_API_URL}${userState.channel}/subscribers/${userState.user['id']}/payment_methods`,
            {
                params: {
                    uid: headers['uid'],
                    client: headers['client'],
                    "access-token": headers["access-token"]
                }
            })
        console.log(payment_res.data?.length && payment_res.data.length > 0, payment_res.data)
        setCustomerInfo(payment_res.data)
        return response && response.data.client_token
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

    const handleSubmit = async (nonce: string) => {
        setLoading(true)
        const headers = JSON.parse(localStorage.getItem('J-tockAuth-Storage'))
        // console.log(payment_methods, payment_methods.length > 0)
        const payment_res = await Axios.get(`${process.env.NEXT_PUBLIC_API_URL}${userState.channel}/subscribers/${userState.user['id']}/payment_methods`,
            {
                params: {
                    uid: headers['uid'],
                    client: headers['client'],
                    "access-token": headers["access-token"]
                }
            })
        if (userState.user['id'] !== null) {
            if (payment_res.data.length > 0) {
                await Axios.put(`${process.env.NEXT_PUBLIC_API_URL}${userState.channel}/subscribers/${userState.user['id']}/payment_methods/null`,
                    {
                        nonce_from_the_client: nonce,
                        uid: headers['uid'],
                        client: headers['client'],
                        "access-token": headers["access-token"]
                    })
                    .then(r => console.log(r))
                    .catch(err => userDispatch({type: 'ERROR'}))
                setLoading(false)
            } else {
                await Axios.post(`${process.env.NEXT_PUBLIC_API_URL}${userState.channel}/subscribers/${userState.user['id']}/payment_methods`,
                    {
                        nonce_from_the_client: nonce,
                        uid: headers['uid'],
                        client: headers['client'],
                        "access-token": headers["access-token"]
                    })
                    .then(r => console.log(r))
                    .catch(err => userDispatch({type: 'ERROR'}))
                setLoading(false)
            }
        }
        setAlert(true)
    }

    const listChannelPlans = async () => {
        await Axios.get(`${process.env.NEXT_PUBLIC_URL}${userState.channel}/subscription_plans/list`).then(r => setChannelPlans(r.data))
    }

    const handleCreatePlan = async (selected_plan: number) => {
        const headers = JSON.parse(localStorage.getItem('J-tockAuth-Storage'))
        await Axios.post(`${process.env.NEXT_PUBLIC_URL}${userState.channel}/payment/create_subscription`,
            {
                subscriber_id: userState.user['id'],
                payment_token: customerInfo.payment_methods[0].token,
                selected_plan: selected_plan,
                uid: headers['uid'],
                client: headers['client'],
                "access-token": headers["access-token"]
            }).then(r => console.log(r))
    }
    console.log(customerInfo)
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
    return (
        <div className="w-full grid place-items-center mt-10">
            <div className="p-2 card bg-08dp shadow-md">
                <div className="form-control card-body">
                    <div className="text-center text-3xl font-bold card-title">Your Account</div>
                    <div className="grid grid-cols-2 mx-10">
                        <div className="card shadow-2xl lg:card-side bg-12dp text-primary-content">
                            <div className="card-body">
                                <p className="text-xl">Payment Method</p>
                                <div className='rounded-box border border-primary p-4 whitespace-nowrap mr-5 my-2'>
                                    <div className='whitespace-nowrap text-lg'>
                                        {customerInfo !== undefined && customerInfo.payment_methods[0].expiration_month + '/' + customerInfo.payment_methods[0].expiration_year + ' '}
                                        {customerInfo !== undefined && customerInfo.payment_methods[0].number}
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img className='float-left mr-2'
                                             src={customerInfo !== undefined ? customerInfo.payment_methods[0]['image_url'] : ''}
                                             alt={customerInfo !== undefined ? customerInfo.payment_methods[0]['payment_type'] : ''}/>
                                        <button
                                            className="btn btn-outline btn-primary rounded-btn btn-sm whitespace-nowrap float-right"
                                            onClick={(e) => console.log(e)}>Delete
                                        </button>
                                    </div>

                                </div>
                                <div className="collapse w-96 rounded-box border border-base-300 collapse-arrow">
                                    <input type="checkbox"/>
                                    <div className="collapse-title text-xl font-medium">
                                        {customerInfo !== undefined && customerInfo.payment_methods.length > 0 ? "Edit Payment Method" : "Add a Payment Method"}
                                    </div>
                                    <div className="collapse-content">
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
                                                <button
                                                    className={loading ? "btn btn-primary loading" : "btn btn-primary"}
                                                    type='submit' onClick={() => router.reload()}>
                                                    {customerInfo !== undefined && customerInfo.payment_methods.length > 0 ? 'Update' : 'Create'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            {alert &&
                            <div className="alert alert-success fixed my-auto">
                                <div className="flex-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                         viewBox="0 0 24 24"
                                         stroke="#2196f3"
                                         className="w-6 h-6 mx-2">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              strokeWidth="2"
                                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                    <label>Success!</label>
                                </div>
                            </div>
                            }
                        </div>
                        <div className="card shadow-2xl lg:card-side bg-12dp text-primary-content ml-5">
                            <div className="card-body">
                                <p className="text-xl">Plans</p>
                                {Object.keys(channelPlans).length > 0 &&
                                <>
                                    {Object.keys(channelPlans).map((value, index) =>
                                        <div key={index}
                                             className="collapse w-96 rounded-box border border-primary my-2 collapse-arrow bg-24dp">
                                            <input type="checkbox"/>
                                            <div className="collapse-title text-xl font-medium capitalize">
                                                {value} <span
                                                className="badge badge-primary ml-5">
                                                    {'$' + channelPlans[value]['price']} {channelPlans[value]['billing_cycle'] <= 11 ? 'per month' : 'per year'}
                                                    </span>
                                            </div>
                                            <div className="collapse-content">
                                                <p>{channelPlans[value]['desc']}</p>
                                                <div className="text-right">
                                                    <button
                                                        className="btn btn-outline btn-primary rounded-btn btn-sm whitespace-nowrap justify-center"
                                                        onClick={() => handleCreatePlan(channelPlans[value]['_id'])}>Subscribe
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Dashboard