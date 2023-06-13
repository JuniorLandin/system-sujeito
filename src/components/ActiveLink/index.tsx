import Link, {LinkProps} from "next/link";
import { useRouter } from "next/router";
import { ReactElement, cloneElement } from "react";

interface ActiveLinkProps extends LinkProps{
  children: ReactElement;
  activeClassName: string;
}

export function ActiveLink({children, activeClassName, ...rest}: ActiveLinkProps){

  const {asPath} = useRouter()

  const className = asPath === rest.href ? activeClassName : ''
  //Se a rota/pagina que estamos acessando for igual ao Link clicado, ativamos o className



    return(
      <Link {...rest} legacyBehavior>
        {cloneElement(children, {
          className
        })}
      </Link>
    )
}