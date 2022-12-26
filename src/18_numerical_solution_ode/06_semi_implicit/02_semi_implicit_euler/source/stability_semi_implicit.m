clear;
clf;
close all;
figure(1);

N=300;
u = linspace(-10.5,10.5,N);
[xx,yy]=meshgrid(u,u);

h=1;

L = xx+i*yy;
A = ones(size(L));
B = -(2+h*h+L);
C = ones(size(L));

Delta = B.*B-4*A.*C;


r1 = (1-h*h/2*L)+(h*h*L.*(h*h/4*L-1)).^(0.5);
r2 = (1-h*h/2*L)-(h*h*L.*(h*h/4*L-1)).^(0.5);

f = abs(1+h*(xx+i*yy)+h*h/2*(xx+i*yy).^2)<1;
f2 = abs(1+h*(xx+i*yy))<1.1;


imagesc(u,u,(abs(real(r2))<1) .* (abs(real(r1))<1) );

%imagesc(u,u,f+f2);
%imagesc(u,u,f2);

%p = 1;
%pp = 1;
%v=0;
%k = 3;
%P=[p];
%for k=[1:200]

    
%    newp = (2+h*h*LL)*p-pp;
%    pp=p;
%    p=newp;

%P=[P,p];
%end

%plot(abs(P));


clear;
figure(2);


p = 1;
v=0;
k = 2;
h=2/sqrt(k)*0.9;
P=[p];
for ii=[1:500]

    %v = v-h*k*p;
    %p = p+h*v;

    v2=v-h*k*p;
    p=(1-h*h*k)*p+h*v;
    v=v2;

    
    P=[P,p];
end

plot(P);