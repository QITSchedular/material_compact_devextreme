import React, { useState, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Form, {
    Item,
    Label,
    ButtonItem,
    ButtonOptions,
    RequiredRule,
    EmailRule
} from 'devextreme-react/form';
import LoadIndicator from 'devextreme-react/load-indicator';
import notify from 'devextreme/ui/notify';
import { useAuth } from '../../contexts/auth';

import SVG1 from '../../assets/SVGs/SVG1.svg';
import SVG2 from '../../assets/SVGs/SVG2.svg';

import './LoginForm.scss';

export default function LoginForm() {
    const navigate = useNavigate();
    const { signIn } = useAuth();
    const [loading, setLoading] = useState(false);
    const formData = useRef({ email: '', password: '' });

    const onSubmit = useCallback(async (e) => {
        e.preventDefault();
        const { email, password } = formData.current;
        setLoading(true);

        const result = await signIn(email, password);
        if (!result.isOk) {
            setLoading(false);
            notify(result.message, 'error', 2000);
        }
    }, [signIn]);

    const onCreateAccountClick = useCallback(() => {
        navigate('/create-account');
    }, [navigate]);

    return (
        <>
            <div className='background-container'>
                <div className='box-1'>
                    <img src={SVG1} height={200} width={200} />
                </div>
                <div className='box-2'>
                    <div className='box-2-container'>
                        <img src={SVG2} height={140} width={140} />
                        <form className='login-form'>
                            <div className='heading'>Signin</div>
                            <div className='sub-heading'>If you are already a member you can login with your username and password.</div>
                            <Form formData={formData.current} disabled={loading}>
                                <Item
                                    cssClass={"text-box"}
                                    dataField={'email'}
                                    editorType={'dxTextBox'}
                                    editorOptions={emailEditorOptions}
                                >
                                    <RequiredRule message="Email is required" />
                                    <EmailRule message="Email is invalid" />
                                    <Label visible={false} />
                                </Item>
                                <Item
                                    cssClass={"text-box"}
                                    dataField={'password'}
                                    editorType={'dxTextBox'}
                                    editorOptions={passwordEditorOptions}
                                >
                                    <RequiredRule message="Password is required" />
                                    <Label visible={false} />
                                </Item>
                                <Item
                                    dataField={'rememberMe'}
                                    editorType={'dxCheckBox'}
                                    editorOptions={rememberMeEditorOptions}
                                >
                                    <Label visible={false} />
                                </Item>
                                <ButtonItem>
                                    <ButtonOptions
                                        // width={'100%'}
                                        type={'default'}
                                        useSubmitBehavior={true}
                                    >
                                        <span className="dx-button-text">
                                            {
                                                loading
                                                    ? <LoadIndicator width={'24px'} height={'24px'} visible={true} />
                                                    : 'Sign In'
                                            }
                                        </span>
                                    </ButtonOptions>
                                </ButtonItem>
                                {/* <Item>
                                    <div className={'link'}>
                                        <Link to={'/reset-password'}>Forgot password?</Link>
                                    </div>
                                </Item>
                                <ButtonItem>
                                    <ButtonOptions
                                        text={'Create an account'}
                                        width={'100%'}
                                        onClick={onCreateAccountClick}
                                    />
                                </ButtonItem> */}
                            </Form>
                        </form>

                    </div>
                </div>
            </div>
        </>
    );
}

const emailEditorOptions = { stylingMode: 'outlined', placeholder: 'Email', mode: 'email' };
const passwordEditorOptions = { stylingMode: 'outlined', placeholder: 'Password', mode: 'password' };
const rememberMeEditorOptions = { text: 'Remember me', elementAttr: { class: 'form-text' } };
