import React, {useContext, useEffect, useState} from "react";
// import braintree from 'braintree-web';
// import DropIn from "braintree-web-drop-in-react";
import {client, hostedFields} from "braintree-web"
import Axios from "axios";
import {Props, UserContext} from "../../components/userContext/user-context";

// export const getServerSideProps: GetServerSideProps = async (context) => {
//     let uri
//     let baseUri = `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_STATION_ID}`
//     // /api/${process.env.NEXT_PUBLIC_STATION_ID}/payment_methods/client_token
//     const res = await fetch(uri)
//     if (res.status !== 200) {
//         const data = {}
//         return {
//             props: {
//                 data,
//             },
//         }
//     } else {
//         const data: Data = await res.json()
//         return {
//             props: {
//                 data,
//             },
//         }
//     }
// }

const Dashboard: React.FC = () => {

    const [client_token, setClientToken] = useState()
    const [loading, setLoading] = useState<boolean>(false)
    // const [hasError, setError] = useState()
    const {userState} = useContext<Props>(UserContext)
    const [payment_methods, setPaymentMethods] = useState([])
    const [progress, setProgress] = useState<boolean>(false)
    const [error, setError] = useState<string[]>()
    const [userId, setUserId] = useState()
// const [headers, setHeaders] = useState({
//     uid: '',
//     client: '',
//     'access-token': ''
    // params: {
        //     uid: headers['uid'],
        //     client: headers['client'],
        //     "access-token": headers["access-token"]
        // }
// })
    useEffect(() => {
        getToken().then(token => instance(token))
    }, [])

    const getToken = async () => {
        const headers = JSON.parse(localStorage.getItem('J-tockAuth-Storage'))
        // console.log(headers)

        // return new Promise(async (resolve, reject) => {
        //     try {
        //         const response = await Axios.get(`http://127.0.0.1:4000/api/${process.env.NEXT_PUBLIC_STATION_ID}/payment_methods/client_token`,
        // {
        // params: {
        //     uid: headers['uid'],
        //     client: headers['client'],
        //     "access-token": headers["access-token"]
        // }
        // }
        // );
        // console.log(response);
        // // resolve(response.data);
        // } catch (err) {
        //     reject(err);
        // }
        // });

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
        setUserId(userState.user['id'])
        // setHeaders({
        //     uid: headers['uid'],
        //     client: headers['client'],
        //     "access-token": headers["access-token"]
        // })
        console.log(payment_res.data)
        // const response = await fetch(`http://127.0.0.1:4000/${process.env.NEXT_PUBLIC_STATION_ID}/payment_methods/client_token`)
        // console.log(response.data.client_token)
        setClientToken(response.data.client_token)
        return response.data.client_token
    }

    const instance = (token: string) => {
        console.log(userId)
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
                    'color': 'black'
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
        // let url = payment_methods.length > 0 ? '/organisations/update_payment_method' : '/organisations/create_payment_method'
        // payment_methods.length > 0 ?
        // setProgress(true)
        const headers = JSON.parse(localStorage.getItem('J-tockAuth-Storage'))
        console.log(userState.user['id'])
        await Axios.post(`http://127.0.0.1:4000/api/${process.env.NEXT_PUBLIC_STATION_ID}/subscribers/3/payment_methods`,
            {
                nonce_from_the_client: nonce,
                // params: {
                //         nonce_from_the_client: nonce,
                        uid: headers['uid'],
                        client: headers['client'],
                        "access-token": headers["access-token"]
                    // }
            })

        // await create(url, {nonce: nonce}, cards.toggle())
        setProgress(false)
    }

    // const braintreeClientSetup = () => {
    //     const styles = {
    //         input: {
    //             'font-size': '14px',
    //             color: '#ffffff',
    //             'font-family': "'Lato', 'Helvetica Neue', Arial, Helvetica, sans-serif",
    //         },
    //         ':focus': {
    //             color: '#ffffff',
    //         },
    //         '.valid': {
    //             color: '#ffffff',
    //         },
    //         '.invalid': {
    //             color: '#ed2f27',
    //         },
    //     };
    //     braintree.setup(client_token, 'custom', {
    //         hostedFields: {
    //             styles,
    //             number: {selector: '#card-number'},
    //             cvv: {selector: '#cvv'},
    //             expirationDate: {selector: '#expiration-date'},
    //         },
    //         paypal: {
    //             singleUse: false,
    //             displayName: 'JeffFillion.com',
    //             locale: 'fr_fr',
    //             headless: true,
    //             onSuccess: (nonce) => {
    //                 const payment = {
    //                     nonce,
    //                     type: 'PayPal',
    //                 };
    //                 handlePayment(payment);
    //             },
    //         },
    //         dataCollector: {
    //             paypal: true,  // Enables fraud prevention
    //         },
    //         onPaymentMethodReceived: (obj) => {
    //             const payment = {
    //                 nonce: obj.nonce,
    //                 type: obj.details.cardType,
    //                 lastTwo: obj.details.lastTwo,
    //             };
    //             handlePayment(payment);
    //         },
    //         onError: (type) => {
    //             console.log('error', type)
    //         },
    //         onReady: (integration) => {
    //             // comp.checkout = integration;
    //             console.log('integration', integration)
    //             setLoading(false)
    //         },
    //     })
    // }
    //
    // const handlePaypalClick = () => {
    //
    // }
    //
    // const handlePayment = (payment: {}) => {
    //
    // }

    // const handleSubmit = (e) => {
    //     console.log('handleSubmit')
    //     e.preventDefault();
    //
    // }

    return (
        <div className="w-full grid place-items-center mt-10">
            <div className="p-2 card bg-12dp shadow-md">
                <div className="form-control card-body">
                    <div className="text-center text-3xl font-bold card-title">Your Account</div>
                    <div className="grid grid-cols-2 mx-10">
                        <div className="card shadow-2xl lg:card-side  text-primary-content">
                            <div className="card-body">
                                <p className="text-xl">Payment Method</p>
                                <div className="justify-end card-actions">
                                    {/*<DropIn*/}
                                    {/*    options={{*/}
                                    {/*        authorization:*/}
                                    {/*            "eyJ2ZXJzaW9uIjoyLCJhdXRob3JpemF0aW9uRmluZ2VycHJpbnQiOiI5YTk5OGE1OWUxOWIwMjI5OGViMTlhYWRhMTBmYzQ0ZjM4YmM3ZDkxYWI2NzczZTY2MDg1YTNmOGE5MTE5MjBlfGNyZWF0ZWRfYXQ9MjAxNy0wNS0xNlQxMDoyMDoyMi4wMTU5NTc5NTMrMDAwMFx1MDAyNm1lcmNoYW50X2FjY291bnRfaWQ9NmNzaGhzNXp4dzV0cnB2c1x1MDAyNm1lcmNoYW50X2lkPWN6dGdjcnBiNXN4eGI3ajhcdTAwMjZwdWJsaWNfa2V5PWZ3bWZmOWpzOHR4cnhyNHAiLCJjb25maWdVcmwiOiJodHRwczovL2FwaS5zYW5kYm94LmJyYWludHJlZWdhdGV3YXkuY29tOjQ0My9tZXJjaGFudHMvY3p0Z2NycGI1c3h4YjdqOC9jbGllbnRfYXBpL3YxL2NvbmZpZ3VyYXRpb24iLCJjaGFsbGVuZ2VzIjpbImN2diJdLCJlbnZpcm9ubWVudCI6InNhbmRib3giLCJjbGllbnRBcGlVcmwiOiJodHRwczovL2FwaS5zYW5kYm94LmJyYWludHJlZWdhdGV3YXkuY29tOjQ0My9tZXJjaGFudHMvY3p0Z2NycGI1c3h4YjdqOC9jbGllbnRfYXBpIiwiYXNzZXRzVXJsIjoiaHR0cHM6Ly9hc3NldHMuYnJhaW50cmVlZ2F0ZXdheS5jb20iLCJhdXRoVXJsIjoiaHR0cHM6Ly9hdXRoLnZlbm1vLnNhbmRib3guYnJhaW50cmVlZ2F0ZXdheS5jb20iLCJhbmFseXRpY3MiOnsidXJsIjoiaHR0cHM6Ly9jbGllbnQtYW5hbHl0aWNzLnNhbmRib3guYnJhaW50cmVlZ2F0ZXdheS5jb20vY3p0Z2NycGI1c3h4YjdqOCJ9LCJ0aHJlZURTZWN1cmVFbmFibGVkIjpmYWxzZSwicGF5cGFsRW5hYmxlZCI6dHJ1ZSwicGF5cGFsIjp7ImRpc3BsYXlOYW1lIjoiVGFwcG9pbnRtZW50IiwiY2xpZW50SWQiOm51bGwsInByaXZhY3lVcmwiOiJodHRwOi8vZXhhbXBsZS5jb20vcHAiLCJ1c2VyQWdyZWVtZW50VXJsIjoiaHR0cDovL2V4YW1wbGUuY29tL3RvcyIsImJhc2VVcmwiOiJodHRwczovL2Fzc2V0cy5icmFpbnRyZWVnYXRld2F5LmNvbSIsImFzc2V0c1VybCI6Imh0dHBzOi8vY2hlY2tvdXQucGF5cGFsLmNvbSIsImRpcmVjdEJhc2VVcmwiOm51bGwsImFsbG93SHR0cCI6dHJ1ZSwiZW52aXJvbm1lbnROb05ldHdvcmsiOnRydWUsImVudmlyb25tZW50Ijoib2ZmbGluZSIsInVudmV0dGVkTWVyY2hhbnQiOmZhbHNlLCJicmFpbnRyZWVDbGllbnRJZCI6Im1hc3RlcmNsaWVudDMiLCJiaWxsaW5nQWdyZWVtZW50c0VuYWJsZWQiOnRydWUsIm1lcmNoYW50QWNjb3VudElkIjoiNmNzaGhzNXp4dzV0cnB2cyIsImN1cnJlbmN5SXNvQ29kZSI6IlVTRCJ9LCJjb2luYmFzZUVuYWJsZWQiOmZhbHNlLCJtZXJjaGFudElkIjoiY3p0Z2NycGI1c3h4YjdqOCIsInZlbm1vIjoib2ZmIiwiYXBwbGVQYXkiOnsic3RhdHVzIjoibW9jayIsImNvdW50cnlDb2RlIjoiVVMiLCJjdXJyZW5jeUNvZGUiOiJVU0QiLCJtZXJjaGFudElkZW50aWZpZXIiOiJtZXJjaGFudC5jb20udGFwcG9pbnRtZW50Iiwic3VwcG9ydGVkTmV0d29ya3MiOlsidmlzYSIsIm1hc3RlcmNhcmQiLCJhbWV4IiwiZGlzY292ZXIiXX0sIm1lcmNoYW50QWNjb3VudElkIjoiNmNzaGhzNXp4dzV0cnB2cyJ9",*/}
                                    {/*    }}*/}
                                    {/*/>*/}
                                    <form id="cardForm">
                                        {/*<InputLabel htmlFor="card-number" error={error?.includes('number')}>Card Number</InputLabel>*/}
                                        <div id="card-number" className="hosted-field mt-3"/>

                                        <div className="row">
                                            <div className="col-6">
                                                {/*<InputLabel htmlFor="expiration-date" error={error?.includes('expirationDate')}>Expiration Date</InputLabel>*/}
                                                <div id="expiration-date" className="hosted-field mt-3"/>
                                            </div>
                                            <div className="col-6">
                                                {/*<InputLabel htmlFor="cvv" error={error?.includes('cvv')}>CVV</InputLabel>*/}
                                                <div id="cvv" className="hosted-field mt-3"/>
                                            </div>
                                        </div>
                                        <div className='text-center mt-3'>
                                            <button className="btn btn-primary" type='submit'>
                                                {/*{cards.payment_methods ? 'Update' : 'Create'}*/}
                                                Create
                                            </button>
                                        </div>
                                    </form>
                                    <button className="btn btn-primary">
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Dashboard