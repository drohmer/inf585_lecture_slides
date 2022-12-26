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

N=100;
for kk=[0:N]

    p2 = p + h*v;
    v2 = v + h*(-k/m*p);
    p=p2;
    v=v2;
    
    P=[P,p];
    V=[V,p];

end


pi=p0;
vi=v0;
Pi=[pi];
Vi=[vi];

for kk=[0:N]

    pi2 = 1/(1+h*h*k/m)*(pi + h*vi);
    vi2 = 1/(1+h*h*k/m)*(-k/m*h*pi+vi);
    pi=pi2;
    vi=vi2;
    
    Pi=[Pi,pi];
    Vi=[Vi,pi];

end

omega=sqrt(k/m);
A=sqrt(p0*p0+v0*v0/omega/omega);
phi=atan2(p0,v0/omega);

t = h*[0:N+1];
T = A*sin(omega*t+phi);


plot(P,'b+-','linewidth',3);

hold on
plot(Pi,'m+-','linewidth',3);
plot(T,'r+-','linewidth',3);
axis([0,N,-2,2]);