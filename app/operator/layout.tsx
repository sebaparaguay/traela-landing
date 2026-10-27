import type { Metadata } from 'next';
export const metadata:Metadata={title:'Traela Operator',manifest:'/operator/manifest.webmanifest',appleWebApp:{capable:true,title:'Traela Operator',statusBarStyle:'default'}};
export default function OperatorLayout({children}:{children:React.ReactNode}){return children;}
