import React, {useContext, useEffect, useState} from "react";
import {client, hostedFields} from "braintree-web"
import Axios from "axios";
import {Props, UserContext} from "../../components/userContext/user-context";
import {useRouter} from "next/router";
import {toast} from "react-toastify";
import useSWR from "swr";
import fetcher from "../../libs/fetcher";
import Spinner from "../../components/layout/spinner"
interface CustomerInfo {
    payment_methods: {
        expiration_month: string
        expiration_year: string
        image_url: string
        number: string
        payment_type: string
        token: string
    }[]
    customer: {
        next_billing_date: string
        plan_id: string
        price: string
        state: string
    }[]
    subscriptions: string[]
}

interface UserProfile {
    id: number
    email: string
    first_name: string
    last_name: string
    subscription: {
        id: number
        ends_at: string
        next_billing_date: string
        next_billing_address: number
        status: string
        payment_method: {
            expiration_month: string
            expiration_year: string
            image_url: string
            number: string
            payment_type: string
            token: string
        }
        subscription_plan: {
            name: string
        }
    }
}

const Dashboard: React.FC = () => {
    const router = useRouter();
    const {userState, userDispatch} = useContext<Props>(UserContext)
    // const [customerInfo, setCustomerInfo] = useState<CustomerInfo>()
    const [channelPlans, setChannelPlans] = useState([])
    const {
        data,
        error
    } = useSWR<UserProfile>(userState.isLogged ? `${process.env.NEXT_PUBLIC_API_URL}${userState.channel}/subscribers/profile` : null, fetcher, {
        onErrorRetry: (error, key, config, revalidate, {retryCount}) => {
            console.log(error, error.message)
            if (error.message.includes('not authorized')) return
        }
    })
    console.log(data)

    useEffect(() => {
        if (userState.isLogged) {
            listChannelPlans().then(() => getToken().then(res => instance(res.token, data)));
        }
    }, [userState.isLogged])

    const getToken = async () => {
        // const headers = JSON.parse(localStorage.getItem('J-tockAuth-Storage'))
        const response = userState.channel !== null && await Axios.get(`${process.env.NEXT_PUBLIC_URL}${userState.channel}/payment/client_token`)
        // const payment_res = userState.channel !== null && await Axios.get(`${process.env.NEXT_PUBLIC_API_URL}${userState.channel}/subscribers/${userState.user['id']}/payment_methods`,
        //     {
        //         params: {
        //             uid: headers['uid'],
        //             client: headers['client'],
        //             "access-token": headers["access-token"]
        //         }
        //     })
        // const profile = userState.channel !== null && await Axios.get(`${process.env.NEXT_PUBLIC_API_URL}${userState.channel}/subscribers/profile`,
        //     {
        //         params: {
        //             uid: headers['uid'],
        //             client: headers['client'],
        //             "access-token": headers["access-token"]
        //         }
        //     })
        // console.log(profile.data)
        // setCustomerInfo(payment_res.data)
        return response && {token: response.data.client_token}
    }

    const destroyPaymentMethod = async (token: string) => {
        const headers = JSON.parse(localStorage.getItem('J-tockAuth-Storage'))
        await Axios.delete(`${process.env.NEXT_PUBLIC_API_URL}${userState.channel}/subscribers/${userState.user['id']}/payment_methods/${token}`, {
            headers: {
                uid: headers['uid'],
                client: headers['client'],
                "access-token": headers["access-token"]
            }
        })
            .then(() => router.reload())
            .catch(() => userDispatch({type: 'ERROR'}))
    }

    const handleSubmit = async (nonce: string, data: UserProfile) => {
        const headers = JSON.parse(localStorage.getItem('J-tockAuth-Storage'))
        if (userState.user['id'] !== null) {
            if (data?.subscription?.payment_method) {
                await Axios.put(`${process.env.NEXT_PUBLIC_API_URL}${userState.channel}/subscribers/${userState.user['id']}/payment_methods/${data.subscription.payment_method.token}`,
                    {
                        nonce_from_the_client: nonce,
                        uid: headers['uid'],
                        client: headers['client'],
                        "access-token": headers["access-token"]
                    })
                    .then(r => router.reload())
                    .catch(err => userDispatch({type: 'ERROR'}))
            } else {
                await Axios.post(`${process.env.NEXT_PUBLIC_API_URL}${userState.channel}/subscribers/${userState.user['id']}/payment_methods`,
                    {
                        nonce_from_the_client: nonce,
                        uid: headers['uid'],
                        client: headers['client'],
                        "access-token": headers["access-token"]
                    })
                    .then(r => router.reload())
                    .catch(() => userDispatch({type: 'ERROR'}))
            }
        }
        toast.success('Success!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }

    const listChannelPlans = async () => {
        await Axios.get(`${process.env.NEXT_PUBLIC_URL}${userState.channel}/subscription_plans/list`).then(r => setChannelPlans(r.data))
    }

    const handleCreatePlan = async (selected_plan: number) => {
        const headers = JSON.parse(localStorage.getItem('J-tockAuth-Storage'))
        {data.subscription.status.includes('Active') && await handleCancelPlan()}
        await Axios.post(`${process.env.NEXT_PUBLIC_URL}${userState.channel}/payment/create_subscription`,
            {
                subscriber_id: userState.user['id'],
                payment_token: data.subscription.payment_method.token,
                selected_plan: selected_plan,
                uid: headers['uid'],
                client: headers['client'],
                "access-token": headers["access-token"]
            }).then(r => router.reload())
    }

    const handleCancelPlan = async () => {
        const headers = JSON.parse(localStorage.getItem('J-tockAuth-Storage'))
        console.log(data)
        await Axios.post(`${process.env.NEXT_PUBLIC_URL}${userState.channel}/payment/cancel_subscription`,
            {
                subscriber_id: userState.user['id'],
                subscription_id: data.subscription.id,
                uid: headers['uid'],
                client: headers['client'],
                "access-token": headers["access-token"]
            }).then(r => router.reload())
    }

    const instance = (token: string, data: UserProfile) => {
        client.create({
            authorization: token
        }, (err, clientInstance) => {
            if (err) {
                console.error(err);
                return;
            }
            createHostedFields(clientInstance, data);
        });
    }

    const createHostedFields = (clientInstance, data) => {
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
                        // setError(err.details?.invalidFieldKeys)
                        return;
                    }
                    handleSubmit(payload.nonce, data).then(r => console.log(r))
                    hostedFieldsInstance.clear('number');
                    hostedFieldsInstance.clear('cvv');
                    hostedFieldsInstance.clear('expirationDate');
                });
            };
            form.addEventListener('submit', tokenize, false);
        });
    }

    if (!userState.isLogged || !data) return <Spinner/>
    return (
        <div className="w-full grid place-items-center mt-10">
            <div className="p-2 card bg-08dp shadow-md">
                <div className="form-control card-body">
                    <div className="text-center text-3xl font-bold card-title">Your Account</div>
                    <div className="grid grid-cols-2 mx-10">
                        <div className="card shadow-2xl lg:card-side bg-12dp text-primary-content">
                            <div className="card-body">
                                <p className="text-xl">Payment Method</p>
                                {data?.subscription?.payment_method !== undefined &&
                                <div className='rounded-box border border-primary p-4 whitespace-nowrap mr-5 my-2'>
                                    <div className='whitespace-nowrap text-lg'>
                                        {data.subscription.payment_method.expiration_month + '/' + data.subscription.payment_method.expiration_year + ' '}
                                        {data.subscription.payment_method.number}
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img className='float-left mr-2'
                                             src={data.subscription.payment_method['image_url']}
                                             alt={data.subscription.payment_method['payment_type']}/>
                                        <button
                                            className="btn btn-outline btn-primary rounded-btn btn-sm whitespace-nowrap float-right"
                                            onClick={() => destroyPaymentMethod(data.subscription.payment_method.token)}>Delete
                                        </button>
                                    </div>
                                </div>
                                }
                                <div className="collapse w-96 rounded-box border border-base-300 collapse-arrow">
                                    <input type="checkbox"/>
                                    <div className="collapse-title text-xl font-medium">
                                        {data.subscription.payment_method !== undefined && data.subscription.payment_method ? "Edit Payment Method" : "Add a Payment Method"}
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
                                                    className={userState.isLoading ? "btn btn-primary loading" : "btn btn-primary"}
                                                    type='submit'>
                                                    {data.subscription.payment_method !== undefined && data.subscription.payment_method ? 'Update' : 'Create'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card shadow-2xl lg:card-side bg-12dp text-primary-content ml-5">
                            <div className="card-body">
                                <p className="text-xl">Plans</p>
                                {Object.keys(channelPlans).length > 0 &&
                                <>
                                    {Object.keys(channelPlans).map((value, index) =>
                                        <div key={index}
                                             className={data.subscription.subscription_plan.name.indexOf(value) !== -1 ? "w-96 rounded-box border border-success my-2 bg-24dp" : "w-96 rounded-box border border-primary my-2 bg-24dp"}>
                                            {/*<input type="checkbox"/>*/}
                                            <div className="collapse-title text-xl font-medium capitalize">
                                                {value} <span
                                                className={data.subscription.subscription_plan.name.indexOf(value) !== -1 ? "badge badge-success ml-5" : "badge badge-primary ml-5"}>
                                                    {'$' + channelPlans[value]['price']} {channelPlans[value]['billing_cycle'] <= 11 ? 'per month' : 'per year'}
                                                    </span>
                                            </div>
                                            <div className="m-3">
                                                <p>
                                                    {data.subscription.subscription_plan.name.indexOf(value) !== -1 &&
                                                    <span
                                                        className={data.subscription.status.includes('Active') ? 'text-success' : ''}>{data.subscription.status}</span>}
                                                </p>
                                                <div className="text-right">
                                                    {data.subscription && data.subscription.subscription_plan.name.indexOf(value) !== -1 && data.subscription.status.includes('Active') ?
                                                        <button
                                                            className="btn btn-primary btn-outline rounded-btn btn-sm whitespace-nowrap justify-center"
                                                            onClick={handleCancelPlan}>Cancel subscription
                                                        </button>
                                                        :
                                                        <button
                                                            className="btn btn-primary btn-outline rounded-btn btn-sm whitespace-nowrap justify-center"
                                                            onClick={() => handleCreatePlan(channelPlans[value]['_id'])}>Subscribe
                                                        </button>
                                                    }
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