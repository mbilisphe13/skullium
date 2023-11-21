import GuestLayout from '@/Layouts/GuestLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import {Head, Link, useForm} from '@inertiajs/react';
import {FormEventHandler} from 'react';

function Page() {
    const {post, processing} = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('verify.phone'));
    };

    return (
        <>
            <Head title="Phone Verification"/>
            <div className="text-2xl text-center my-4">
                Verify Phone
            </div>
            <div className="mb-4 text-sm text-gray-600">
                Please verify your phone number by clicking on the link we texted to you.
                If you didn't receive the text, you can request another one by clicking the button below.
            </div>

            <form onSubmit={submit}>
                <div className="mt-4 flex items-center justify-between">
                    <PrimaryButton disabled={processing}>Send Link</PrimaryButton>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Log Out
                    </Link>
                </div>
            </form>
        </>
    );
}

Page.layout = (page: Page) => <GuestLayout children={page} />

export default Page;
