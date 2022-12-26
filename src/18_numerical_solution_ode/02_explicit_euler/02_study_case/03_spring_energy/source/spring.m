clear;
clf;

p0 = 1;
v0 = 0;

p=p0;
v=v0;

P=[p0];
V=[v0];

h=0.25;
m=1;
k=1;

N=70;
for kk=[0:N]

    p2 = p + h*v;
    v2 = v + h*(-k/m*p);
    p=p2;
    v=v2;
    
    P=[P,p];
    V=[V,p];

end

omega=sqrt(k/m);
A=sqrt(p0*p0+v0*v0/omega/omega);
phi=atan2(p0,v0/omega);

t = h*[0:N+1];
T = A*sin(omega*t+phi);


plot(P,'b+-','linewidth',3);
hold on
plot(T,'r+-','linewidth',3);
