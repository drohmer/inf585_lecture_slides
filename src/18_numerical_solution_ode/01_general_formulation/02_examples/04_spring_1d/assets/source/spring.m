clear;
clf;

N=300;
t = linspace(0,50,N);

k=2;
m=1;
p0=1;
v0=2;
l0=0.5;
omega = sqrt(k/m);
A=sqrt((p0-l0)^2+(v0/omega));
phi=atan2(p0-l0,v0/omega);

p = A*sin(omega*t+phi)+l0;

plot(t,p);