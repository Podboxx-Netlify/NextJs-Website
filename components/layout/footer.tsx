export default function Footer({...props})  {
    return (
        <footer className="site-footer mt-12 object-none object-bottom">
            <p className="select-none">&copy; {new Date().getFullYear()} <a
                className="-primary">{props.data?.title || 'Loading...'}</a> &bull; Powered by &nbsp;
                <a target="_blank" rel="noreferrer" href="https://www.podboxx.com">PodBoxx</a></p>
        </footer>
    );
}