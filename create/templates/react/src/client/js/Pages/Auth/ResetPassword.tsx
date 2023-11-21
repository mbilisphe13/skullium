import { useEffect, FormEventHandler } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';

function Page({ signature, email, id }: { signature: string, email: string, id: string }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: email,
        password: '',
        passwordConfirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'passwordConfirmation');
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.reset', {id, email, signature}));
    };

    return (
        <>
            <Head title="Reset Password" />

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        readOnly={true}
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        isFocused={true}
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="passwordConfirmation" value="Confirm Password" />

                    <TextInput
                        type="password"
                        name="passwordConfirmation"
                        value={data.passwordConfirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('passwordConfirmation', e.target.value)}
                    />

                    <InputError message={errors.passwordConfirmation} className="mt-2" />
                </div>

                <div className="flex items-center justify-end mt-4">
                    <PrimaryButton className="ml-4" disabled={processing}>
                        Reset Password
                    </PrimaryButton>
                </div>
            </form>
        </>
    );
}

Page.layout = (page: Page) => <GuestLayout children={page} />

export default Page;